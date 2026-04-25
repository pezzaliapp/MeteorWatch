# MeteorWatch v1.1.0 — Kit per il lancio LinkedIn

> **Nota editoriale.** I post sono stati scritti per mantenere il focus sull'app come strumento divulgativo della serie PezzaliAPP. Il workflow di sviluppo tecnico è documentato nei commit del repo e nel CHANGELOG, per chi vuole approfondire.

Tre versioni del post, screenshot consigliati e commento da pubblicare per primo. Lunghezze ottimizzate per LinkedIn (1.300–1.800 caratteri per il post principale).

> Disclaimer ricorrente in tutte le versioni: MeteorWatch è uno strumento divulgativo basato su API pubbliche NASA / JPL / ESA / CelesTrak. **Non sostituisce sistemi ufficiali di difesa planetaria.**

URL canonici (in custom domain) usati ovunque:

- App: `https://www.alessandropezzali.it/MeteorWatch/`
- Sister app: `https://www.alessandropezzali.it/CubeSat_Constellation/`
- Brand serie: `https://pezzaliapp.com`
- Profilo autore: `https://alessandropezzali.it`

---

## Versione A — Divulgativa pura

**Quando usarla:** se vuoi parlare prima di tutto al pubblico curioso, agli appassionati di astronomia, agli insegnanti e ai divulgatori. Tono editoriale, racconto del cielo. PezzaliAPP entra come contesto editoriale, non come pitch.

### Testo (~1.700 caratteri)

```
Ogni notte sopra le nostre teste passa qualcosa: la Stazione Spaziale, una pioggia di Liridi, un asteroide che sfiora la Terra a poche distanze lunari, un vecchio satellite in rientro.

Ho rilasciato MeteorWatch v1.1, una piccola web app che ho costruito per rispondere a una domanda semplice: cosa sta succedendo lassù, adesso?

In una sola dashboard trovi la fase della Luna di stanotte, gli orari del crepuscolo civile, nautico e astronomico per la tua posizione, i prossimi passaggi visibili della ISS a occhio nudo (con export .ics da aggiungere al calendario), gli sciami meteorici attivi con il loro ZHR, l'asteroide ravvicinato del giorno, i bolidi registrati e l'ultima immagine della Terra inviata dal satellite DSCOVR.

La sezione Sky Tonight è pensata per chi guarda davvero il cielo: quando esce la Luna, quando il buio è abbastanza profondo per le meteore deboli, dove cercare il radiante.

È in italiano e inglese, dark mode, mobile first, installabile come app. Funziona anche offline.

I dati arrivano tutti da fonti pubbliche e gratuite — NASA, JPL CNEOS, ESA, CelesTrak — citate in ogni sezione. È uno strumento divulgativo, non sostituisce i sistemi ufficiali di difesa planetaria.

Fa parte di PezzaliAPP, la mia serie di piccoli strumenti digitali per chi è curioso. È pensata per appassionati di astronomia, studenti, insegnanti, divulgatori, e chiunque ami camminare col naso all'insù.

🌐 https://www.alessandropezzali.it/MeteorWatch/
🛰 Sister app 3D (TLE viewer): https://www.alessandropezzali.it/CubeSat_Constellation/
✨ Serie PezzaliAPP: https://pezzaliapp.com

#Astronomia #Divulgazione #PWA #SpaceTech #NASA #OpenScience #PezzaliAPP
```

### Hashtag (7)

`#Astronomia` `#Divulgazione` `#PWA` `#SpaceTech` `#NASA` `#OpenScience` `#PezzaliAPP`

### Screenshot consigliati (4)

1. **Sky Tonight** — Luna SVG con illuminazione + tip osservativo + crepuscoli del Sole. È l'immagine più "umana" e parla immediatamente al pubblico divulgativo.
2. **Earth Live** — mappa Leaflet con tile **NASA GIBS MODIS Terra true-color** + terminatore giorno/notte visibile (tasto "☀ day/night" attivo). Bellissima da scrollare in feed.
3. **APOD** — la card hero con l'immagine astronomica del giorno e il titolo. Cattura subito.
4. **Mobile bottom nav** — screenshot mobile con la `BottomNav` visibile (Home / Stanotte / Asteroidi / Sciami / ISS) per dare l'idea che è una vera app installabile.

### First comment

Aggiungi questo commento subito sotto il post per non penalizzare la reach con troppi link nel corpo:

```
Per chi vuole approfondire 👇
• Codice (MIT): https://github.com/pezzaliapp/MeteorWatch
• Sister app 3D: https://www.alessandropezzali.it/CubeSat_Constellation/
• Repo sister app: https://github.com/pezzaliapp/CubeSat_Constellation
• Profilo autore: https://alessandropezzali.it
• Tutti i progetti PezzaliAPP: https://pezzaliapp.com

Tutte le fonti dati sono pubbliche: NASA NeoWs, CNEOS Sentry/Fireball, CelesTrak (TLE), wheretheiss.at, NASA APOD/EPIC/GIBS. Niente API a pagamento, niente tracking, geolocation opt-in.
```

---

## Versione B — Build in public / tech storytelling

**Quando usarla:** se il pubblico target prevalente di quel giorno sono colleghi tech, dev frontend, PM. Più dettaglio architetturale, performance, accessibility, vincoli auto-imposti, pattern delle app sister.

### Testo (~1.770 caratteri)

```
Ho rilasciato MeteorWatch v1.1, una PWA divulgativa che aggrega in un'unica dashboard asteroidi NEO, bolidi, sciami meteorici, rientri atmosferici, posizione live della ISS e immagini della Terra dal satellite DSCOVR.

Qualche scelta tecnica che mi è piaciuta nel costruirla.

Stack: React 18 + Vite + TypeScript, TailwindCSS dark mode, Leaflet per le mappe 2D, satellite.js per i calcoli orbitali (SGP4, ground track, pass predictor con flag di visibilità a occhio nudo) — tutti lato client, nessun backend. Cache offline con idb-keyval + Workbox: l'app è installabile e funziona anche senza rete.

Vincoli che mi sono dato: costo zero, zero tracking. Le fonti sono solo pubbliche e gratuite — NASA NeoWs, CNEOS Sentry e Fireball, CelesTrak (TLE), wheretheiss.at, NASA APOD, EPIC e GIBS (tile satellitari WMTS — MODIS, VIIRS, Black Marble). Geolocation rigorosamente opt-in. Niente API a pagamento, niente piani premium, licenze tutte rispettate.

Performance e accessibility: code-split delle rotte (bundle principale ~230 KB, Leaflet in chunk separato caricato solo dove serve), Skeleton loaders, focus-visible ring, skip-link, rispetto di prefers-reduced-motion.

Pattern che mi piace: MeteorWatch è la dashboard degli eventi, la sister app CubeSat Constellation è il viewer 3D delle orbite. Dove serve il 3D, MeteorWatch genera un deep-link col TLE in base64 e cede il palco. Due app sister che si rispettano, niente codice duplicato.

Fa parte di PezzaliAPP, la mia serie di piccoli strumenti digitali costruiti come side project che mi diverte mantenere.

🌐 https://www.alessandropezzali.it/MeteorWatch/
🛰 https://www.alessandropezzali.it/CubeSat_Constellation/
✨ https://pezzaliapp.com

#BuildInPublic #ReactJS #TypeScript #PWA #SpaceTech #IndieWeb #PezzaliAPP
```

### Hashtag (7)

`#BuildInPublic` `#ReactJS` `#TypeScript` `#PWA` `#SpaceTech` `#IndieWeb` `#PezzaliAPP`

### Screenshot consigliati (4)

1. **ISS Live** — mappa con ground track + marker ISS + tabella "prossimi 3 passaggi" con AOS/elev/durata e bottone `⤓ Esporta calendario .ics`. Dimostra il pass predictor.
2. **Earth Live** — toggle layer mappa visibile (`OSM / MODIS / VIIRS / NIGHT`) e terminatore polilinea + cerchietto giallo del subsolar point. Mostra l'integrazione GIBS.
3. **Home** — dashboard con le card sky-status, NEO ravvicinato, ultimo bolide, **APOD card** e **EPIC card** affiancate. Trasmette la varietà di fonti.
4. **Mobile bottom nav** — screenshot mobile con la BottomNav, eventualmente affiancato a uno snippet del bundle (`main 230 KB / leaflet 154 KB chunk separato`) per chi apprezza il dettaglio perf.

### First comment

```
Qualche numero per chi è curioso 👇
• Bundle: main JS 230 KB / 80 KB gzip (Leaflet in chunk separato, 44 KB gzip)
• 36 unit test Vitest (formatters, riskCalculator, sgp4Lite, moonPhase, sunCalc, dayNightTerminator…)
• Repo MIT: https://github.com/pezzaliapp/MeteorWatch
• CHANGELOG: https://github.com/pezzaliapp/MeteorWatch/blob/main/CHANGELOG.md
• Architettura: https://github.com/pezzaliapp/MeteorWatch/blob/main/ANALISI_INIZIALE.md
• Sister app 3D: https://www.alessandropezzali.it/CubeSat_Constellation/ (repo: https://github.com/pezzaliapp/CubeSat_Constellation)
• Tutti i progetti PezzaliAPP: https://pezzaliapp.com
```

---

## Versione C — Bilanciata *(consigliata per il profilo Alessandro Pezzali)*

**Quando usarla:** è la scelta di default per il pubblico misto LinkedIn (dev + designer + PM + appassionati). Apre con un'immagine evocativa, scende sul concreto in tre punti, chiude con il valore divulgativo e con la coerenza della serie PezzaliAPP.

### Testo (~1.620 caratteri)

```
Stanotte sopra di te passeranno la Stazione Spaziale, qualche scia delle Liridi e probabilmente un asteroide a poche distanze lunari. Per saperlo non serve un dottorato: basta avere lo strumento giusto.

Ho rilasciato MeteorWatch v1.1, una PWA che mette in un colpo d'occhio cosa cade, passa o entra in atmosfera vicino alla Terra. È pensata per appassionati di cielo, studenti, insegnanti e divulgatori.

Le sezioni che mi divertono di più:
— Sky Tonight: fase lunare, crepuscoli, ISS visibile a occhio nudo, sciami attivi, NEO del giorno — calcolati sulla tua posizione (opt-in).
— Earth: ultime immagini di DSCOVR EPIC + tile satellitari NASA GIBS (MODIS, VIIRS, Black Marble) con terminatore giorno/notte.
— ISS Live: pass predictor 48h con export .ics da aggiungere al calendario.

Sotto il cofano: React + TypeScript, mappe Leaflet, calcoli orbitali con satellite.js lato client, cache offline. Tutte le fonti sono pubbliche e gratuite — NASA, JPL CNEOS, ESA, CelesTrak — citate in ogni sezione. È uno strumento divulgativo, non sostituisce i sistemi ufficiali di difesa planetaria.

Fa parte di PezzaliAPP, la mia serie di piccoli strumenti digitali. È gemella di CubeSat Constellation, il viewer 3D di TLE: due app che condividono filosofia ma con scope diversi — la dashboard degli eventi qui, la visualizzazione 3D delle orbite di là.

🌐 https://www.alessandropezzali.it/MeteorWatch/
🛰 https://www.alessandropezzali.it/CubeSat_Constellation/
✨ Serie PezzaliAPP: https://pezzaliapp.com

#Astronomia #Divulgazione #PWA #ReactJS #SpaceTech #NASA #PezzaliAPP
```

### Hashtag (7)

`#Astronomia` `#Divulgazione` `#PWA` `#ReactJS` `#SpaceTech` `#NASA` `#PezzaliAPP`

### Screenshot consigliati (4)

1. **Sky Tonight** — la card Luna (SVG fase + illuminazione + età) accanto alla card Sole con i tre crepuscoli. È il volto più riconoscibile del prodotto.
2. **Earth Live** — mappa GIBS MODIS true-color con terminatore + EPIC card sotto con l'ultima immagine DSCOVR. Doppio impatto visivo.
3. **Asteroidi** — lista NEO con risk indicator semaforo + chip "PHA / Sentry" + filtri PHA/distanza/dimensione. Trasmette il "data dashboard" senza essere troppo nerd.
4. **Mobile installato (PWA)** — screenshot da telefono con icona MeteorWatch sulla home screen accanto ad altre app, oppure splash screen. Comunica subito "è una vera app, posso installarla".

### First comment

```
Qualche link extra per chi vuole approfondire 👇

• Codice MIT: https://github.com/pezzaliapp/MeteorWatch
• CHANGELOG v1.1: https://github.com/pezzaliapp/MeteorWatch/blob/main/CHANGELOG.md
• Sister app 3D — CubeSat Constellation: https://www.alessandropezzali.it/CubeSat_Constellation/ (repo: https://github.com/pezzaliapp/CubeSat_Constellation)
• Profilo autore: https://alessandropezzali.it
• Tutti i progetti della serie PezzaliAPP: https://pezzaliapp.com

Tutto open source, dati solo da API pubbliche (NASA, JPL CNEOS, ESA, CelesTrak), niente tracking. Suggerimenti, segnalazioni o idee per la v1.2 sono benvenuti — apritemi pure una issue su GitHub.
```

---

## Note operative per la pubblicazione

- **Quando postare**: martedì, mercoledì o giovedì, 8:30–10:00 (CET). Picco di attenzione del pubblico tech europeo. Evitare lunedì mattina e venerdì pomeriggio.
- **Singolo carosello vs. immagine**: gli screenshot proposti sono 4 → su LinkedIn rendono meglio in **carosello PDF** o come **4 immagini separate** (max 9). Una singola hero image va bene se è quella di Sky Tonight in dark mode.
- **Alt-text**: ricordati di aggiungere descrizioni alt agli screenshot (la PWA è accessibile, il post che la presenta dovrebbe esserlo a sua volta).
- **Tag persone**: se rilevante, taggare la community PezzaliAPP, divulgatori scientifici amici, o chi ti ha aiutato in beta-test. **Non** taggare account NASA / JPL / ESA: non hanno relazione con il progetto, sarebbe percepito come spam.
- **Risposta ai commenti**: tieni pronto un mini-FAQ — "è gratis?", "funziona offline?", "raccoglie dati?", "posso installarla su iPhone?" — risposte brevi pronte da incollare aiutano a tenere alta la conversazione nelle prime due ore (decisive per la reach).
- **Cross-posting**: la versione B funziona molto bene riadattata in inglese su X / Mastodon / Bluesky. La versione A sta meglio su LinkedIn e Threads.
- **Disclaimer in immagine**: se posti uno screenshot della Home, includi quello che mostra il banner "Strumento divulgativo. Non sostituisce sistemi ufficiali di difesa planetaria." — coerenza con il messaggio del post.

## Quale versione consiglio io

**Versione C — Bilanciata.** Centra il profilo Alessandro Pezzali: tecnico ma non solo per tecnici, divulgativo ma con la parte di codice riconoscibile, con PezzaliAPP che chiude il cerchio della serie. Le versioni A e B sono ottime come fallback per pubblicazioni successive (es. ripostare la stessa release a 7–10 giorni con angolazione diversa, evitando di sembrare lo stesso post).
