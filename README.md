# MeteorWatch — PezzaliAPP

> *What's falling, passing or reentering near Earth right now — and should I worry?*
>
> *Cosa sta cadendo, passando o entrando nell'atmosfera vicino alla Terra adesso, e devo preoccuparmi?*

[![Deploy](https://github.com/pezzaliapp/MeteorWatch/actions/workflows/deploy.yml/badge.svg)](https://github.com/pezzaliapp/MeteorWatch/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-installable-magenta)](https://www.alessandropezzali.it/MeteorWatch/)

🌐 **Live**: https://www.alessandropezzali.it/MeteorWatch/
🛰 **Sister app**: [CubeSat Constellation](https://github.com/pezzaliapp/CubeSat_Constellation)

---

## English

MeteorWatch is an open-source Progressive Web App (PWA) that aggregates **public NASA, JPL, ESA, CelesTrak data** to give an at-a-glance view of:

- Near-Earth Objects (asteroids and PHAs) in the next 7 days
- Recent fireballs / bolides on a world map
- Famous meteorite falls and classification
- Active and upcoming meteor showers
- Predicted atmospheric reentries of artificial objects
- Live ISS tracking with naked-eye pass predictions

| Feature | Description |
|---|---|
| 🌌 **Sky status** | Aggregated NEO + fireball semaphore (green/yellow/red) |
| 🌙 **Sky Tonight** | Moon phase, sun + twilights, ISS passes, active showers, today's NEO |
| 🖼️ **APOD** | NASA Astronomy Picture of the Day + 7-day archive |
| 🌍 **Earth Live** | DSCOVR EPIC images + NASA GIBS satellite layers (MODIS, VIIRS) with day/night terminator |
| ☄️ **NEO feed** | NASA NeoWs 7-day feed with name search, PHA/distance/size filters and Sentry top |
| 🔥 **Fireballs** | World map (OSM or NASA GIBS) with energy-scaled markers from CNEOS Fireball DB |
| 🪨 **Meteorites** | 8 famous falls + classification glossary, link to Meteoritical Bulletin DB |
| ✨ **Meteor showers** | Annual calendar timeline, ZHR, parent body, observation tip |
| 📉 **Reentry** | BSTAR-based lifetime estimate, 90-min ground track, ±20% disclaimer |
| 🛰️ **ISS Live** | Real-time position, day/night terminator, 48h pass predictor, .ics calendar export |
| 📚 **Education** | Glossary, history, scientific pipeline, official sources |
| 🌍 **i18n** | Italian + English with browser auto-detection |
| 🔔 **Opt-in alerts** | NEO threshold, fireballs, ISS visible passes |
| 📱 **PWA** | Offline cache, installable, mobile-first dark theme |
| ↗️ **Share** | Web Share API + clipboard fallback for events |

### Quick start

```bash
git clone https://github.com/pezzaliapp/MeteorWatch.git
cd MeteorWatch
npm install
cp .env.example .env  # optional: set VITE_NASA_API_KEY
npm run dev           # → http://localhost:5173/MeteorWatch/
```

```bash
npm run build         # tsc + vite build
npm run preview       # vite preview --port 4173
npm run lint
npm run test
```

### Deploy

A push to `main` triggers `.github/workflows/deploy.yml`:
1. `npm ci && npm run lint && npm run test && npm run build`
2. Upload `dist/` artifact
3. Deploy to GitHub Pages with CNAME `www.alessandropezzali.it`

### Roadmap

- Historical/future close approaches per NEO (CNEOS CAD batch)
- Celestial-sphere SVG map for meteor shower radiants
- Periodic Background Sync where browser supports it
- Playwright e2e tests
- AR mode for sky pointing (DeviceOrientationEvent)

### Credits

- NASA / JPL — NeoWs, CNEOS Sentry, Fireball DB, CAD
- ESA NEO Coordination Centre
- CelesTrak — TLE data
- wheretheiss.at — ISS live position
- International Meteor Organization
- Meteoritical Bulletin Database
- OpenStreetMap contributors

### License

MIT © 2025–2026 Alessandro Pezzali

### Author

[PezzaliAPP](https://www.pezzaliapp.com) — Alessandro Pezzali

---

## Italiano

MeteorWatch è una **PWA open-source** che aggrega dati pubblici **NASA, JPL, ESA, CelesTrak** per dare a colpo d'occhio:

- Oggetti vicini alla Terra (NEO e PHA) nei prossimi 7 giorni
- Bolidi recenti / fireball su mappa mondiale
- Cadute famose di meteoriti e loro classificazione
- Sciami meteorici attivi e in arrivo
- Rientri atmosferici previsti di oggetti artificiali
- Tracking live della ISS con predizione passaggi a occhio nudo

| Feature | Descrizione |
|---|---|
| 🌌 **Status del cielo** | Semaforo aggregato NEO + bolidi (verde/giallo/rosso) |
| 🌙 **Cielo stanotte** | Fase lunare, sole + crepuscoli, passaggi ISS, sciami attivi, NEO di oggi |
| 🖼️ **APOD** | NASA Astronomy Picture of the Day + archivio 7 giorni |
| 🌍 **Terra dallo spazio** | Immagini DSCOVR EPIC + tile NASA GIBS (MODIS, VIIRS) con terminatore giorno/notte |
| ☄️ **NEO feed** | Feed NASA NeoWs 7 giorni con ricerca per nome, filtri PHA/distanza/dimensione e Sentry top |
| 🔥 **Bolidi** | Mappa mondiale (OSM o NASA GIBS) con marker scalati per energia da CNEOS Fireball DB |
| 🪨 **Meteoriti** | 8 cadute famose + glossario classi, link a Meteoritical Bulletin DB |
| ✨ **Sciami meteorici** | Calendario annuale, ZHR, corpo progenitore, consigli di osservazione |
| 📉 **Rientri** | Stima vita orbitale da BSTAR, ground track 90 min, disclaimer ±20% |
| 🛰️ **ISS Live** | Posizione real-time, terminatore giorno/notte, pass predictor 48h, export `.ics` |
| 📚 **Educa** | Glossario, storia, filiera scientifica, fonti ufficiali |
| 🌍 **i18n** | Italiano + inglese con auto-detection del browser |
| 🔔 **Alert opzionali** | Soglia NEO, bolidi, passaggi ISS visibili |
| 📱 **PWA** | Cache offline, installabile, tema dark mobile-first |
| ↗️ **Condividi** | Web Share API + fallback clipboard per gli eventi |

### Avvio rapido

```bash
git clone https://github.com/pezzaliapp/MeteorWatch.git
cd MeteorWatch
npm install
cp .env.example .env  # opzionale: imposta VITE_NASA_API_KEY
npm run dev           # → http://localhost:5173/MeteorWatch/
```

```bash
npm run build         # tsc + vite build
npm run preview       # vite preview --port 4173
npm run lint
npm run test
```

### Deploy

Un push su `main` triggera `.github/workflows/deploy.yml`:
1. `npm ci && npm run lint && npm run test && npm run build`
2. Upload artifact `dist/`
3. Deploy su GitHub Pages con CNAME `www.alessandropezzali.it`

### Avviso

> Strumento divulgativo basato su dati pubblici NASA / JPL / ESA / CelesTrak.
> **Non sostituisce sistemi ufficiali di difesa planetaria.**
> Le stime di rientro hanno un'incertezza tipica di ±20%.

### Roadmap

- Approcci passati/futuri per ciascun NEO (CNEOS CAD batch)
- Mappa radianti su sfera celeste SVG
- Periodic Background Sync dove supportato
- Test e2e con Playwright
- Modalità AR puntamento cielo (DeviceOrientationEvent)

### Crediti

- NASA / JPL — NeoWs, CNEOS Sentry, Fireball, CAD
- ESA NEO Coordination Centre
- CelesTrak — TLE
- wheretheiss.at — Posizione ISS
- International Meteor Organization
- Meteoritical Bulletin Database
- OpenStreetMap contributors

### Licenza

MIT © 2025–2026 Alessandro Pezzali

### Autore

[PezzaliAPP](https://www.pezzaliapp.com) — Alessandro Pezzali
