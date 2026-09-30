// Revisa alertas.json contra precios reales (CoinGecko) y avisa por Telegram.
// Corre desde GitHub Actions cada 15 min — ver .github/workflows/alertas-precio.yml
const fs = require('fs');

async function main() {
  const alertas = JSON.parse(fs.readFileSync('alertas.json', 'utf8'));
  const assets = (alertas.assets || []).filter(a => a.above || a.below);
  if (!assets.length) { console.log('Sin alertas configuradas.'); return; }

  let estado = {};
  try { estado = JSON.parse(fs.readFileSync('estado.json', 'utf8')); } catch (e) {}

  const cryptoAssets = assets.filter(a => a.type !== 'accion');
  const stockAssets = assets.filter(a => a.type === 'accion');
  const prices = {}; // id -> usd

  // CoinGecko a veces bloquea/limita las IPs compartidas de GitHub Actions.
  // Binance no requiere clave y sirve de respaldo cuando eso pasa.
  const BINANCE_SYMBOLS = { bitcoin: 'BTCUSDT', ethereum: 'ETHUSDT', solana: 'SOLUSDT' };
  if (cryptoAssets.length) {
    try {
      const ids = cryptoAssets.map(a => a.id).join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
      if (!res.ok) throw new Error('CoinGecko HTTP ' + res.status);
      const data = await res.json();
      cryptoAssets.forEach(a => { if (data[a.id]) prices[a.id] = data[a.id].usd; });
    } catch (e) {
      console.error('CoinGecko falló, probando Binance:', e.message);
    }
    const faltantes = cryptoAssets.filter(a => !prices[a.id] && BINANCE_SYMBOLS[a.id]);
    await Promise.all(faltantes.map(async a => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${BINANCE_SYMBOLS[a.id]}`);
        const d = await res.json();
        if (d.price) prices[a.id] = parseFloat(d.price);
      } catch (e) { console.error('Binance también falló para', a.id, e.message); }
    }));
  }
  const finnhubKey = process.env.FINNHUB_API_KEY;
  if (stockAssets.length && finnhubKey) {
    await Promise.all(stockAssets.map(async a => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${a.id}&token=${finnhubKey}`);
        const d = await res.json();
        if (d.c) prices[a.id] = d.c;
      } catch (e) {}
    }));
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  async function avisar(texto) {
    console.log('AVISO:', texto);
    if (!token || !chatId) { console.log('Falta TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID — no se envía.'); return; }
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: texto })
    });
  }

  for (const a of assets) {
    const price = prices[a.id];
    if (!price) continue;

    if (a.above) {
      const key = a.id + '_above';
      if (price >= a.above && !estado[key]) {
        await avisar(`📈 ${a.symbol} subió a $${price.toLocaleString('en-US')} — cruzó tu alerta de $${a.above}`);
        estado[key] = true;
      } else if (price < a.above * 0.995) {
        estado[key] = false; // se re-arma si vuelve a bajar, para avisar de nuevo si vuelve a subir
      }
    }
    if (a.below) {
      const key = a.id + '_below';
      if (price <= a.below && !estado[key]) {
        await avisar(`📉 ${a.symbol} bajó a $${price.toLocaleString('en-US')} — cruzó tu alerta de $${a.below}`);
        estado[key] = true;
      } else if (price > a.below * 1.005) {
        estado[key] = false;
      }
    }
  }

  fs.writeFileSync('estado.json', JSON.stringify(estado, null, 2) + '\n');
}

main().catch(e => { console.error(e); process.exit(1); });
