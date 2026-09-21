// sync.js — sincronización de localStorage con el repo de GitHub (Mis-apps)
// Requiere localStorage.github_pat (token fine-grained, permiso Contents R/W sobre este repo).
// Si no hay token o no hay red, todo sigue funcionando solo con localStorage (no rompe nada).
(function(){
  const API = 'https://api.github.com/repos/darioxavier126-dotcom/Mis-apps/contents/data/';

  function getPat(){ try{ return localStorage.getItem('github_pat') || ''; }catch(e){ return ''; } }
  function b64encode(str){ return btoa(unescape(encodeURIComponent(str))); }
  function b64decode(b64){ return decodeURIComponent(escape(atob(b64.replace(/\n/g,'')))); }

  // ---- Modo simple: una clave estática de localStorage <-> data/<key>.json ----
  async function pull(key){
    const pat = getPat(); if(!pat) return false;
    try{
      const res = await fetch(API + key + '.json', { headers:{ 'Authorization':'Bearer '+pat, 'Accept':'application/vnd.github+json' } });
      if(!res.ok) return false; // 404 = aún no existe en el repo, normal la primera vez
      const json = await res.json();
      localStorage.setItem(key, b64decode(json.content));
      localStorage.setItem('_sync_sha_'+key, json.sha);
      return true;
    }catch(e){ return false; }
  }

  async function push(key){
    const pat = getPat(); if(!pat) return false;
    const value = localStorage.getItem(key); if(value===null) return false;
    try{
      const sha = localStorage.getItem('_sync_sha_'+key) || undefined;
      const body = { message:'sync: '+key, content: b64encode(value) };
      if(sha) body.sha = sha;
      const res = await fetch(API + key + '.json', {
        method:'PUT', headers:{ 'Authorization':'Bearer '+pat, 'Accept':'application/vnd.github+json', 'Content-Type':'application/json' },
        body: JSON.stringify(body)
      });
      if(res.ok){ const json = await res.json(); localStorage.setItem('_sync_sha_'+key, json.content.sha); return true; }
      return false;
    }catch(e){ return false; }
  }

  // ---- Modo prefijo: varias claves "prefijo:algo" <-> data/<nombre>.json (objeto {clave: valor}) ----
  function collectPrefix(prefix){
    const out = {};
    try{
      for(let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i);
        if(k && k.indexOf(prefix)===0) out[k] = localStorage.getItem(k);
      }
    }catch(e){}
    return out;
  }

  async function pullPrefix(prefix, fileName){
    const pat = getPat(); if(!pat) return false;
    try{
      const res = await fetch(API + fileName + '.json', { headers:{ 'Authorization':'Bearer '+pat, 'Accept':'application/vnd.github+json' } });
      if(!res.ok) return false;
      const json = await res.json();
      const obj = JSON.parse(b64decode(json.content));
      Object.keys(obj).forEach(k=>{ try{ localStorage.setItem(k, obj[k]); }catch(e){} });
      localStorage.setItem('_sync_sha_'+fileName, json.sha);
      return true;
    }catch(e){ return false; }
  }

  async function pushPrefix(prefix, fileName){
    const pat = getPat(); if(!pat) return false;
    try{
      const obj = collectPrefix(prefix);
      const sha = localStorage.getItem('_sync_sha_'+fileName) || undefined;
      const body = { message:'sync: '+fileName, content: b64encode(JSON.stringify(obj)) };
      if(sha) body.sha = sha;
      const res = await fetch(API + fileName + '.json', {
        method:'PUT', headers:{ 'Authorization':'Bearer '+pat, 'Accept':'application/vnd.github+json', 'Content-Type':'application/json' },
        body: JSON.stringify(body)
      });
      if(res.ok){ const json = await res.json(); localStorage.setItem('_sync_sha_'+fileName, json.content.sha); return true; }
      return false;
    }catch(e){ return false; }
  }

  window.jarvisSync = { pull, push, pullPrefix, pushPrefix };
})();
