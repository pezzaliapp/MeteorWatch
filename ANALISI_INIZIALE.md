# MeteorWatch — Analisi iniziale

## Scopo

PWA divulgativa che risponde alla domanda:
> *"Cosa sta cadendo, passando o entrando nell'atmosfera vicino alla Terra adesso, e devo preoccuparmi?"*

Target: appassionati di astronomia, studenti, divulgatori, radioamatori, osservatori del cielo.

**Strumento divulgativo, NON sostituisce sistemi ufficiali di difesa planetaria.**

Sister app di **CubeSat Constellation** — condivide stile e si collega via deep link (`?tle=<base64TLE>`), senza duplicarne il codice.

## Architettura

```
┌─────────────────────────────────────────────────────────────┐
│              Browser PWA (offline-capable)                  │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ Pages (UI) │→ │ Services + │→ │ idb-keyval cache     │  │
│  │ React-Router│  │ Lib (TS)   │  │ + service worker     │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
│         │              │                    │              │
│         ▼              ▼                    ▼              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ NASA / JPL — NeoWs, Sentry, Fireball, CAD            │ │
│  │ wheretheiss.at — ISS live                            │ │
│  │ CelesTrak — TLE (ISS, last-30-days reentry group)    │ │
│  │ IMO — meteor calendar (curated JSON locale)          │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

Calcoli orbitali (propagazione SGP4, ground track, pass predictor, BSTAR lifetime) tutti **client-side** via `satellite.js` — nessun backend.

## Stack scelto e motivazioni

| Tecnologia | Motivazione |
|---|---|
| **React 18 + Vite + TypeScript** | DX rapida, type safety, build veloci, HMR, ottime performance bundle |
| **TailwindCSS** dark-mode-first | Coerenza con CubeSat Constellation, prototipazione rapida, design system in tokens |
| **Leaflet + react-leaflet** | Mappa 2D leggera (~40 KB gzipped), no token, OSS, supporta tile dark via CSS |
| **Zustand** + persist | State management minimale, no boilerplate Redux, persistenza localStorage |
| **vite-plugin-pwa (Workbox)** | Manifest, SW autoUpdate, runtime caching declarativo |
| **idb-keyval** | Cache IndexedDB con API key/value (più semplice di Dexie per il nostro caso) |
| **satellite.js** | SGP4/SDP4 client-side per ISS e rientri |
| **date-fns** | Timezone-aware, tree-shakable, multi-locale (it/en) |
| **react-router-dom v6** | Routing standard con `basename="/MeteorWatch"` |

## Fonti dati

| Fonte | Endpoint | TTL cache | Fallback |
|---|---|---|---|
| NASA NeoWs | `api.nasa.gov/neo/rest/v1` | 6 h | DEMO_KEY + JSON locale |
| CNEOS Fireball | `ssd-api.jpl.nasa.gov/fireball.api` | 24 h | JSON locale |
| CNEOS Sentry | `ssd-api.jpl.nasa.gov/sentry.api` | 12 h | array vuoto |
| CNEOS CAD | `ssd-api.jpl.nasa.gov/cad.api` | 12 h | array vuoto |
| ISS Live | `api.wheretheiss.at/v1/satellites/25544` | 10 s | last cached |
| CelesTrak TLE ISS | `celestrak.org/.../CATNR=25544` | 6 h | TLE statico |
| CelesTrak Reentry group | `celestrak.org/.../GROUP=last-30-days` | 6 h | JSON locale |
| IMO Meteor calendar | curato in `services/meteorShowersData.ts` | n/a (statico) | — |
| **NASA APOD** | `api.nasa.gov/planetary/apod` | 6 h | DEMO_KEY |
| **NASA EPIC** | `epic.gsfc.nasa.gov/api/natural` | 2 h | array vuoto |
| **NASA GIBS** | `gibs.earthdata.nasa.gov/wmts/...` (WMTS REST) | tile-cache via SW | OSM |

## Decisioni architetturali

1. **Base path**: `/MeteorWatch/` per Vite, manifest, router, SW. CNAME `www.alessandropezzali.it`.
2. **PWA scope**: `/MeteorWatch/` con `start_url` corrispondente.
3. **Service Worker** (vite-plugin-pwa):
   - StaleWhileRevalidate per API NASA/JPL/CelesTrak (TTL diversi)
   - NetworkFirst per ISS live (timeout 4s)
   - CacheFirst per fallback data
   - navigateFallback per SPA routing offline
4. **Cache layer applicativo**: ogni servizio passa da `lib/apiCache.ts` con TTL e fallback offline. Doppia protezione (SW + idb-keyval).
5. **API key NASA**: `VITE_NASA_API_KEY` con fallback `DEMO_KEY` (rate-limited ma funziona out-of-the-box).
6. **Calcoli orbitali**: `satellite.js` lato client. BSTAR-lifetime è una euristica con incertezza dichiarata ±20%.
7. **Deep link CubeSat Constellation**: `lib/deepLinkBuilder.ts` costruisce `https://pezzaliapp.github.io/CubeSat_Constellation/?tle=<base64TLE>`. Non duplichiamo codice 3D.
8. **i18n**: file JSON in `src/i18n/{it,en}.json`, lingua di default = browser, fallback IT, sync `<html lang>`.
9. **Geolocalizzazione**: opt-in via `useGeolocation`. Fallback Roma (lat 41.9028, lon 12.4964).
10. **Disclaimer**: banner persistente + modale al primo accesso. Fonte dati visibile in ogni sezione.
11. **Notifiche**: opt-in. Scheduler poll ogni 5 min con anti-spam log in localStorage (cooldown 12h).
12. **Testing**: Vitest per logica pura (formatters, calcolatori, deep link, sgp4, risk).
13. **Lint + Build prima di ogni commit** è policy CLAUDE.md.

## Scelte di design

- Sfondo dark-space (radial gradient nero/blu notte)
- Accenti **ciano** (#5cf0ff) e **magenta** (#ff5cd0)
- Semaforo **verde / giallo / rosso** per livelli di rischio (low/mid/high)
- Font monospace per dati tecnici (JetBrains Mono → fallback)
- Glassmorphism leggero su card e header (`backdrop-blur-md`)
- Mobile-first, BottomNav su < md, fix iOS (`--vh` hack, `apple-mobile-web-app-capable`)
- Footer con link a CubeSat Constellation, pezzaliapp.com, GitHub
- Animazioni discrete (twinkle stars, pulse-slow risk indicator)

## Roadmap

### v1.1 — completato (2026-04-25)
- ✅ Sky Tonight con luna/sole/twilights/ISS/sciami/NEO
- ✅ NASA APOD integration (Home + /apod + 7-day archive)
- ✅ NASA EPIC + NASA GIBS satellite layers
- ✅ Day/night terminator su mappa ISS e Earth
- ✅ NEO search + Web Share API
- ✅ Code-split routes, Skeleton, ErrorBoundary
- ✅ A11y: skip-link, focus-visible, prefers-reduced-motion
- ✅ Desktop nav

### v1.2+ (incrementale)
- Tab "approcci storici / futuri" nel dettaglio NEO via CNEOS CAD batch
- Mappa radianti meteor showers (sfera celeste SVG)
- Periodic Background Sync per notifiche se browser supporta
- Storico bolidi più ricco (filtri lat/lon, heat-map)
- Test e2e con Playwright
- AR mode (DeviceOrientationEvent) puntamento cielo

### v2.x (visione)
- Dataset offline più ampio (snapshot mensile pre-bundled)
- Integrazione ESA NEO Coordination Centre API quando aperta al pubblico
- AR mode per puntare il telefono al cielo (DeviceOrientationEvent)
- Modulo "fotografare meteorite" con guidance visuale

## File chiave

```
vite.config.ts          → base path /MeteorWatch/, vite-plugin-pwa
src/lib/apiCache.ts     → cachedFetch con TTL + stale fallback
src/lib/sgp4Lite.ts     → propagazione SGP4 + BSTAR lifetime
src/lib/passPredictor.ts→ pass predictor con visibility flag
src/lib/icsExporter.ts  → export .ics dei passaggi
src/lib/deepLinkBuilder.ts → ponte verso CubeSat Constellation
src/services/*          → uno per fonte dati
src/store/*             → zustand persisted
.github/workflows/deploy.yml → CI/CD su gh-pages
```
