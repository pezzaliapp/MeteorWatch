# Changelog

All notable changes to **MeteorWatch** are documented here.
This project follows [Conventional Commits](https://www.conventionalcommits.org/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-04-25

### Added — Initial public release

- **Scaffolding** — React 18 + Vite + TypeScript + TailwindCSS, ESLint flat config, Prettier, Vitest. Base path `/MeteorWatch/` for GitHub Pages deploy under `https://www.alessandropezzali.it/MeteorWatch/`.
- **PWA foundation** — `vite-plugin-pwa` with manifest, autoUpdate service worker, Workbox runtime caching strategies, app icons (192, 512, maskable, apple-touch).
- **Data layer** — services for NASA NeoWs, CNEOS Sentry/Fireball/CAD, ISS (wheretheiss.at), CelesTrak TLE, IMO meteor showers; offline cache with `idb-keyval`; curated fallbacks per source.
- **Home dashboard** — sky status semaforo, ISS live, NEO ravvicinato, ultimo bolide, sciame attivo, prossimo rientro, top NEO Sentry. Deep link a CubeSat Constellation.
- **Asteroidi (NEO)** — feed 7 giorni con filtri (PHA / < 1 LD / ≥ 100 m) e ordinamento; tab Sentry top con Palermo Scale; NeoOrbitSvg per visualizzazione orbita relativa.
- **Bolidi** — mappa Leaflet mondiale con marker scala-log per energia, popup, filtri anno + energia minima, lista cronologica.
- **Meteoriti** — 8 cadute famose su mappa, classificazione (condriti, acondriti, ferro, pallasiti), link Meteoritical Bulletin Database.
- **Sciami meteorici** — 9 sciami curati con periodo attivo, picco, ZHR, velocità, parent body, radiante; calendario annuale SVG con cursore "oggi" e wrap-around.
- **Rientri atmosferici** — TLE da CelesTrak last-30-days filtrati a quota < 600 km; stima vita orbitale residua client-side da BSTAR + mean motion; ground track 90 min; deep link 3D.
- **ISS Live** — posizione real-time refresh 5s, mappa con ground track e footprint, pass predictor 48h con visibility flag (sole sotto -6°), export `.ics` dei prossimi 3 passaggi, deep link 3D.
- **Educa** — glossario bilingue 18 termini, "come riconoscere un meteorite", storia eventi (Chicxulub → DART), filiera scientifica (Catalina, Pan-STARRS, ATLAS, Vera Rubin, NASA Planetary Defense), fonti ufficiali.
- **i18n** — IT + EN con detection automatica del browser, sync `<html lang>`, persistenza zustand, fallback IT.
- **Notifiche** — opt-in con toggle in About, soglia NEO configurabile (LD), check periodico ogni 5 min per NEO ravvicinati / bolidi significativi / passaggi ISS visibili imminenti, anti-spam con cooldown 12h.
- **Disclaimer** — modale al primo accesso + banner persistente; credit fonti dati visibili in ogni sezione.
- **Deploy** — GitHub Action con build + lint + test, upload artifact, deploy a GitHub Pages, CNAME `www.alessandropezzali.it`.

### Known TODOs

- Notifiche via Periodic Background Sync (limitato dal supporto browser)
- Tab "approcci storici / futuri" nel detail NEO (richiede CAD batch — MVP ora usa solo close-approach corrente)
- Mappa radianti su sfera celeste (MVP usa coordinate testuali; visual SVG futuro)
- Test e2e con Playwright (MVP ha solo test unit per logica pura)

### Credits

Dati pubblici: NASA / JPL CNEOS, ESA NEO Coordination Centre, CelesTrak, IMO, Meteoritical Bulletin Database, OpenStreetMap, wheretheiss.at.
