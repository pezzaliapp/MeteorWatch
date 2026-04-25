# CLAUDE.md — MeteorWatch

Guidance for Claude Code when working in this repository.

## Scope

**MeteorWatch** è una PWA della serie PezzaliAPP, sister app di **CubeSat Constellation** (https://github.com/pezzaliapp/CubeSat_Constellation).

Risponde alla domanda: *"Cosa sta cadendo, passando o entrando nell'atmosfera vicino alla Terra adesso, e devo preoccuparmi?"*

Strumento divulgativo per appassionati di astronomia, studenti, divulgatori, radioamatori e osservatori del cielo. **NON sostituisce** sistemi ufficiali di difesa planetaria.

Copre: asteroidi NEO, bolidi/fireball, meteoriti catalogati, sciami meteorici, rientri atmosferici di oggetti artificiali, ISS tracker.

## Stack scelto e motivazioni

| Tecnologia | Motivazione |
|------------|-------------|
| **React 18 + Vite + TypeScript** | DX rapida, type safety, build veloci, HMR |
| **TailwindCSS dark-mode-first** | Coerenza con CubeSat Constellation, prototipazione rapida |
| **Leaflet** | Mappa 2D leggera per fireball/ISS/rientri (no token, OSS) |
| **Zustand** | State management minimale, no boilerplate Redux |
| **Workbox** | Service worker production-grade per offline e cache |
| **idb-keyval** | Cache IndexedDB con API key/value (più semplice di Dexie) |
| **satellite.js** | SGP4/SDP4 client-side per ISS e rientri |
| **date-fns** | Timezone e formattazione (più tree-shakable di moment) |
| **react-router-dom v6** | Routing standard con basename `/MeteorWatch` |

## Convenzioni di commit

Conventional Commits in italiano/inglese:

- `feat:` nuova feature
- `fix:` bug fix
- `chore:` manutenzione, build, deps
- `docs:` documentazione
- `refactor:` refactor senza cambio comportamento
- `style:` formattazione
- `test:` test
- `release:` rilascio versionato

Esempi:
- `feat: aggiungi sezione bolidi con mappa Leaflet`
- `fix: correggi calcolo BSTAR per rientri`
- `release: v1.0.0 — initial public release`

## Permessi pre-approvati

I seguenti comandi sono autorizzati senza chiedere conferma all'utente, **solo dentro la cartella di progetto** (`/Users/alessandropezzali/MeteorWatch/`):

- `npm`, `npx`, `node`
- `git`, `gh`
- `vite`, `tsc`
- `eslint`, `prettier`
- `vitest`
- `mkdir`, `touch`, `cat`, `ls`, `mv`, `cp`, `rm` (solo all'interno della cartella di progetto)

## Fetch consentiti

Le seguenti origini sono autorizzate:

- `api.nasa.gov`
- `ssd-api.jpl.nasa.gov`
- `celestrak.org`
- `api.wheretheiss.at`
- `epic.gsfc.nasa.gov`
- `gibs.earthdata.nasa.gov`
- `registry.npmjs.org`

## Workflow operativo — preferenze utente

### Documentazione → push diretto su main pre-approvato
Per modifiche che riguardano SOLO file di documentazione, commit
e push diretto su `main` sono pre-approvati e non richiedono
conferma esplicita.

File coperti dalla policy:
- `docs/**` (qualsiasi file dentro la cartella docs)
- `README.md`, `CHANGELOG.md`, `ANALISI_INIZIALE.md`, `CLAUDE.md`,
  `LICENSE`, `CONTRIBUTING.md` di root
- File `.md` di documentazione in genere

### Codice → sempre via branch + PR
Per qualsiasi modifica a codice o configurazioni dell'app usare
sempre branch dedicato + Pull Request:
- `src/**`, `public/**`, `scripts/**`
- Configurazioni: `vite.config.ts`, `package.json`, `tsconfig*.json`,
  `tailwind.config.*`, `eslint.config.*`, `.prettierrc*`, ecc.
- Workflow CI/CD: `.github/**`

### In caso di modifica mista (docs + codice)
Trattare l'intero set come "codice" → branch + PR.

### File privati di marketing/comunicazione
I post per social, le strategie di lancio, e qualsiasi materiale
che non sia documentazione tecnica del progetto NON vanno
committati nel repo pubblico.
- Tenerli in `~/MeteorWatch-private/` (fuori dal git tracking)
  oppure in `/docs/private/` (coperto da `.gitignore`)
- Mai committare file con nome `*.private.md`, `drafts/`,
  `marketing/`

## Decisioni architetturali (NON ridiscutere)

1. **Base path**: `/MeteorWatch/` per Vite, manifest, router, SW. Deploy target `https://www.alessandropezzali.it/MeteorWatch/`.
2. **PWA scope**: `/MeteorWatch/` con `start_url` corrispondente.
3. **Service Worker**:
   - Network-first per API live (fallback cache)
   - Cache-first per asset statici (immutable hash)
   - Stale-while-revalidate per NEO (TTL 6h) e fireball (TTL 24h)
4. **Cache layer**: ogni servizio API passa da `/lib/apiCache.ts` (idb-keyval) con TTL e fallback offline.
5. **API key NASA**: `VITE_NASA_API_KEY` con fallback `DEMO_KEY` (rate-limited ma funziona).
6. **Calcoli orbitali**: `satellite.js` lato client, no backend.
7. **Deep link a CubeSat Constellation**: `lib/deepLinkBuilder.ts` costruisce `https://pezzaliapp.github.io/CubeSat_Constellation/?tle=<base64TLE>`. Non duplicare codice della sister app.
8. **i18n**: file JSON in `src/i18n/{it,en}.json`, lingua di default = browser, fallback IT.
9. **Geolocalizzazione**: opt-in via `useGeolocation` hook, fallback Roma (lat 41.9028, lon 12.4964).
10. **Disclaimer**: banner persistente o modale al primo accesso. Fonte dati visibile in ogni sezione.
11. **Stile**: dark-space (nero/blu notte), accenti ciano/magenta, semaforo verde/giallo/rosso, font monospace per dati tecnici, glassmorphism su card e header. Mobile-first con fix iOS (--vh hack, `apple-mobile-web-app-capable`).
12. **Footer**: link a CubeSat Constellation e pezzaliapp.com, label "PezzaliAPP — MeteorWatch".
13. **GitHub Action**: deploy automatico su `gh-pages` al push su `main`. CNAME = `www.alessandropezzali.it`.
14. **Testing**: Vitest per logica pura (formatters, calcolatori, deep link). No e2e nello scope iniziale.
15. **Lint**: ESLint flat config + Prettier. `npm run lint` e `npm run build` devono passare prima di ogni commit.

## Script npm

```
dev       — Vite dev server
build     — tsc + vite build
preview   — vite preview (porta 4173)
lint      — eslint .
format    — prettier --write .
test      — vitest run
deploy    — push a main (deploy automatico via Action)
```

## Struttura

```
src/
  components/   common/, maps/, charts/
  pages/        Home, Asteroids, Fireballs, Meteorites, MeteorShowers,
                Reentry, ISSLive, Education, About
  services/     nasaNeoApi, cneosFireballApi, cneosSentryApi, cneosCadApi,
                issApi, celestrakApi, meteorShowersData
  lib/          sgp4Lite, riskCalculator, passPredictor, icsExporter,
                deepLinkBuilder, apiCache
  store/        eventsStore, settingsStore, userLocationStore
  hooks/        useGeolocation, useNotifications, useOnlineStatus,
                usePeriodicSync, useNasaApi
  utils/        dates, units, formatters
  types/
  i18n/         it.json, en.json, index.ts
public/         manifest.json, icons/, fallback-data/, CNAME
```

## Linee guida operative

- **Autonomia**: scegli alternative tecniche di pari valore senza chiedere; documenta qui se la scelta è strutturale.
- **Errori**: 3 tentativi prima di fermarti.
- **API down**: usa fallback curati (`public/fallback-data/`) e procedi.
- **MVP first**: se una feature è troppo complessa, fai MVP e annota TODO nel CHANGELOG.
- **Disclaimer divulgativo** sempre presente.
