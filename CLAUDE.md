# CLAUDE.md — Sistema Operativo Personal de Darío

> **Estado a 2026-08-31.** Este archivo vive dentro del repo `Mis-apps` para quedar versionado junto a las apps. Es la fuente de verdad del proyecto; actualízalo cada vez que se agregue o rediseñe una app.

## Quién soy y cómo trabajo
- Darío Calle Cedeño, estudiante de Negocios Internacionales (UEES, Guayaquil, Ecuador), freelancer en construcción (AI Automation Specialist en Upwork).
- Trabajo SIEMPRE en español.
- Prefiero que se me diga qué hacer directo, no demasiadas opciones abiertas.
- Uso esto **casi exclusivamente desde el celular (iPhone)** — todo mobile-first, poca fricción, "TDAH-friendly" (mínima fricción, pocos campos a la vez, nada de scroll interminable).
- Cada herramienta tiene que verse y sentirse **completamente distinta** a las demás — nunca repetir el mismo patrón visual. Si algo empieza a parecerse a otra pieza ya construida, se rediseña.

## Repositorio y hosting
- **Repo público de GitHub:** `darioxavier126-dotcom/Mis-apps`
- **GitHub Pages:** rama `main`, carpeta `/ (root)`. URL base: `https://darioxavier126-dotcom.github.io/Mis-apps/`
- Todo `.html` nuevo en la raíz queda accesible en `.../Mis-apps/nombre.html` automáticamente.
- **PIN de acceso compartido: `3751`** — cada app tiene pantalla de PIN que guarda `localStorage.setItem('habit_unlocked','yes')`. Es filtro cosmético (el código fuente es público), NO usar para datos sensibles de verdad (ver regla de Finanzas abajo).
- Identidad de git del repo: `user.email dario.calle@uees.edu.ec`, `user.name darioxavier126-dotcom`.

## Stack técnico (sin build step — HTML puro + CDN)
- **Three.js r128** — fondos 3D de varias apps.
- **GSAP 3.12.2** — animaciones de entrada, hover con física (`back.out`), toasts, transición de páginas.
- **Lenis 1.1.13** — scroll suave (en las apps con scroll). En apps de una sola pantalla no aplica.
- **Google Fonts** por `<link>`, distintas según la app: Fraunces, IBM Plex Sans/Mono, Caveat, Courier Prime, Special Elite, Instrument Serif, Inter, Spectral, y **Petit Formal Script** (la firma "Darío Calle" que aparece discreta abajo en cada app).
- **Persistencia:** `localStorage` del navegador, clave propia por app (tabla abajo). Los datos NO se sincronizan entre dispositivos: viven solo en el navegador donde se usaron. **Todo acceso a localStorage va envuelto en try/catch** (hay entornos que lo bloquean y rompían el PIN).
- No hay backend ni build para estas apps — son `.html` autocontenidos.

## Las 11 apps construidas

| Archivo | Nombre | Identidad visual | Fondo | Clave localStorage |
|---|---|---|---|---|
| `index.html` | Rastreador de hábitos | Crema/dorado/marino, diario de bitácora, lomo de cuaderno | Cintas de aurora 3D (three.js) | `habit:YYYY-MM-DD` |
| `metas.html` | Panel de metas | Marino oscuro, latón, **"Horizonte de tiempo"** | Monolitos 3D a la distancia = años; suelo que corre (three.js) | `goals` |
| `errores.html` | Bitácora de errores | Papel envejecido, sello rojo, máquina de escribir | Papeles cayendo en 3D + líneas redactadas | `errorlog` |
| `sesgos.html` | Detector de sesgos | Violeta/cian sobre púrpura | Red neuronal 3D real | `biaslog` |
| `cerebro.html` | Segundo cerebro | Azul espacio, dorado estelar | **Cerebro 3D** de neuronas + sinapsis a pantalla completa | `brain` (+ `brain_api_key`) |
| `habilidades.html` | Mapa de habilidades | Verde esmeralda / ámbar, atlas topográfico | Terreno de curvas de nivel 3D | `skillmap` |
| `sustancias.html` | Protocolo (suplementación) | Crema clínica, acento por compuesto, **reloj de 24h** | Gradientes de color en movimiento | `sustancias:YYYY-MM-DD` (+ `sustancias_day1`, `sustancias_horarios`, `sustancias_reminders_on`) |
| `comprimir.html` | Compresor de libros/cursos | Negro óptico, espectro, **prisma/destilación** | Prisma 3D: luz blanca → espectro (three.js) | `biblioteca` |
| `sparring.html` | Sparring de tesis | Carmín vs acero, **cuadrilátero/boxeo** | Ring 2D: chispas que chocan en el centro | `sparring` (**IA**: ataca la tesis y juzga réplicas) |
| `tendencias.html` | Traductor de tendencias | Ámbar sobre negro, **tablero de aeropuerto (split-flap)** | Franjas de salón + filas que voltean | `tendencias` (+ `tendencias_temas`) (**IA + búsqueda web**: escanea el mundo) |
| `voz.html` | Escribir con mi voz | Tinta-noche, **caligrafía viva** | Tinta fluyendo en campo de flujo (canvas 2D) | `voz_perfil`, `voz_textos` (**IA**: aprende tu estilo y reescribe) |
| `comprimir.html` | Compresor de libros/cursos | Negro óptico, espectro, **prisma/destilación** | Prisma 3D: luz blanca → espectro (three.js) | `biblioteca` |
| `inversiones.html` | Terminal (Bitcoin/inversiones) | Verde fósforo sobre negro, **terminal de trading** monoespaciada | Scanlines CRT sutiles | `inversiones` (precios vía API pública de CoinGecko, sin clave) |

**Nota de proveedor de IA (2026-09-01):** las 4 apps con IA (Cerebro, Sparring, Tendencias, Mi voz) migraron de Anthropic a **Google Gemini** (`gemini-3.6-flash`, capa gratis de Google AI Studio) por costo — clave en `gemini_api_key`. Todas reintentan 3 veces si Google devuelve 503 (modelo saturado). Terminal usa el mismo patrón para su lectura de tendencia de mercado.

## Patrones compartidos (reutilizar, no reinventar)
- **PIN gate** idéntico en lógica (clave `3751`, guarda `habit_unlocked`), con "Bienvenido, Darío" + try/catch en localStorage.
- **Navegación** entre las 8 apps en cada página.
- **Transición entre páginas:** efecto "iris" (círculo `#veil-iris` que crece/encoge con el color de acento de la app) vía GSAP — reemplazó al `page-veil` de fundido plano.
- **Toast de confirmación** animado ("Guardado correctamente ✓") en cada acción que guarda.
- **Firma personal:** "Darío Calle" en Petit Formal Script, fija abajo, sutil.
- **Botón "pop":** `transform:scale` con rebote elástico (`cubic-bezier(0.34,1.56,0.64,1)`) + `touch-action:manipulation` para que el doble-tap-zoom del iPhone no estorbe.
- **Arquitectura de fondo protagonista** (cerebro, metas, protocolo): el fondo 3D ocupa toda la pantalla y el contenido vive en paneles/muelles flotantes translúcidos, nunca cajas opacas que tapen el fondo.
- Cada app **valida su JS** (0 errores de sintaxis) antes de subir y **escapa el HTML** del contenido que escribe el usuario.

**Cerebro** además: panel "Preguntar a tu cerebro" — pega la clave de API de Anthropic (ahora **sí se guarda** en `brain_api_key` en el dispositivo, con botón "Olvidar clave"), llama directo a `api.anthropic.com` con `anthropic-dangerous-direct-browser-access: true`, mandando las notas como contexto. Modelo: `claude-sonnet-5`.

## El proyecto de Finanzas — NO vive en este repo
- Carpeta local `~/finanzas-dario`, deploy en **Cloudflare Workers** (NO GitHub) porque trae datos financieros reales, protegido con **Cloudflare Access**.
- **Regla de seguridad de TODO el proyecto:** cualquier página con datos reales sensibles no puede ir a un repo público con solo PIN — necesita auth real (Cloudflare Access) o quedarse fuera de internet.

## Principios de diseño
1. **Identidad visual única por app.** Antes de construir, definir paleta + concepto de fondo que no se parezca a ninguna de las existentes, y confirmarlo antes de escribir código.
2. **Mobile-first, mínima fricción.** Captura rápida sobre formularios largos; acordeones colapsados por defecto; nada que corte palabras ni superponga elementos en celular.
3. **Nunca reinventar infraestructura.** Reutilizar PIN, iris, toast, firma, reveal por scroll, hover GSAP.
4. **Nada de secretos en el código.** Ninguna clave de API en el HTML (excepción consciente: la de Cerebro se guarda en el dispositivo del usuario, nunca en el repo).
5. **Verdad incómoda antes que inventar datos.** Si algo no se puede confirmar, decirlo.
6. **Diseño de nivel profesional**, no plantilla genérica: mucha animación, botones interactivos, fondo en movimiento, que se vea como algo que pondrías de fondo de pantalla.

## Roadmap — Plan Maestro de 25 sistemas

### Fase 0 — Victorias rápidas ✅ COMPLETA
1. ✅ Rastreador de hábitos · 2. ✅ Panel de metas · 3. ✅ Archivo de errores · 4. ✅ Detector de sesgos
*(Bonus completo: Dashboard financiero — en repo aparte)*

### Fase 1 — El núcleo ✅ COMPLETA
5. ✅ Segundo cerebro

### Fase 2 — Capas sobre el núcleo ✅ COMPLETA
6. ✅ Mapa de habilidades
7. ✅ Compresor de libros/cursos
8. ✅ Sparring de tesis y argumentos
9. ✅ Traductor de tendencias globales
10. ✅ Sistema de escritura con su voz

*(Bonus fuera del plan, completo: `sustancias.html` — Protocolo de suplementación.)*

### Fase 3 — Vida diaria automatizada (SIGUE AQUÍ)
11. ⏳ Planificador semanal automático ← **SIGUE AQUÍ** · 12. Asistente de trámites/documentos · 13. Dashboard de vida unificado · 14. Motor de decisiones repetitivas · 15. Simulador de decisiones importantes

### Fase 4 — Crecimiento profesional
16. Entrenador de negociación · 17. Entrenador de presentaciones · 18. Simulador de entrevistas · 19. Idiomas a medida · 20. Portafolio dinámico

### Fase 5 — Oportunista
21. Red de contactos · 22. Simulador de escenarios financieros · 23. Monitor de oportunidades freelance · 24. Pipeline idea → producto · 25. (Motor de aprendizaje, fusionado en Fase 2/4)

**Regla de sueño no negociable:** mínimo 5 h/noche. Ninguna fase asume noches sin dormir.

## Comandos útiles

```bash
git clone https://github.com/darioxavier126-dotcom/Mis-apps.git
cd Mis-apps
# tras cualquier cambio:
git add . && git commit -m "Descripción" && git push
```

No hay `npm install` — son HTML autocontenidos.
