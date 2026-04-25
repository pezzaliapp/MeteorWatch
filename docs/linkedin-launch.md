# MeteorWatch v1.1.0 — Kit per il lancio LinkedIn

Tre versioni del post, screenshot consigliati e commento da pubblicare per primo. Lunghezze ottimizzate per LinkedIn (1.300–1.800 caratteri per il post principale).

> Disclaimer ricorrente in tutte le versioni: MeteorWatch è uno strumento divulgativo basato su API pubbliche NASA / JPL / ESA / CelesTrak. **Non sostituisce sistemi ufficiali di difesa planetaria.**

---

## Versione A — Divulgativa pura

**Quando usarla:** se vuoi parlare prima di tutto al pubblico curioso, agli appassionati di astronomia, agli insegnanti e ai divulgatori. Tono editoriale, racconto del cielo. Tech in sottofondo.

### Testo (~1.510 caratteri)

```
Ogni notte sopra le nostre teste passa qualcosa: la Stazione Spaziale, una pioggia di Liridi, un asteroide che sfiora la Terra a poche distanze lunari, un vecchio satellite in rientro.

Ho rilasciato MeteorWatch v1.1, una piccola web app che ho costruito per rispondere a una domanda semplice: cosa sta succedendo lassù, adesso?

In una sola dashboard trovi la fase della Luna di stanotte, gli orari del crepuscolo civile, nautico e astronomico per la tua posizione, i prossimi passaggi visibili della ISS a occhio nudo (con export .ics da aggiungere al calendario), gli sciami meteorici attivi con il loro ZHR, l'asteroide ravvicinato del giorno, i bolidi registrati e l'ultima immagine della Terra inviata dal satellite DSCOVR.

La sezione Sky Tonight è pensata per chi guarda davvero il cielo: quando esce la Luna, quando il buio è abbastanza profondo per le meteore deboli, dove cercare il radiante.

È in italiano e inglese, dark mode, mobile first, installabile come app. Funziona anche offline.

I dati arrivano tutti da fonti pubbliche e gratuite — NASA, JPL CNEOS, ESA, CelesTrak — citate in ogni sezione. È uno strumento divulgativo, non sostituisce i sistemi ufficiali di difesa planetaria.

Pensato per appassionati di astronomia, studenti, insegnanti, divulgatori, e chiunque ami camminare col naso all'insù.

🌐 https://www.alessandropezzali.it/MeteorWatch/
🛰 Sister app 3D (TLE viewer): https://pezzaliapp.github.io/CubeSat_Constellation/

#Astronomia #Divulgazione #PWA #SpaceTech #NASA #OpenScience #PezzaliAPP
```

### Hashtag (7)

`#Astronomia` `#Divulgazione` `#PWA` `#SpaceTech` `#NASA` `#OpenScience` `#PezzaliAPP`

### Screenshot consigliati (4)

1. **Sky Tonight** — Luna SVG con illuminazione + tip osservativo + crepuscoli del Sole. È l'immagine più "umana" e parla immediatamente al pubblico divulgativo.
2. **Earth Live** — mappa Leaflet con tile **NASA GIBS MODIS Terra true-color** + terminatore giorno/notte visibile (tasto "☀ day/night" attivo). Bellissima da scrollare in feed.
3. **APOD** — la card hero con l'immagine astronomica del giorno e il titolo. Cattura subito.
4. **Mobile bottom nav** — screenshot mobile con la `BottomNav` visibile (Home / Stanotte / Asteroidi / Sciami / ISS / …) per dare l'idea che è una vera app installabile.

### First comment

Aggiungi questo commento subito sotto il post per non penalizzare la reach con troppi link nel corpo:

```
Per chi vuole approfondire 👇
• Codice (MIT): https://github.com/pezzaliapp/MeteorWatch
• Sister app 3D: https://github.com/pezzaliapp/CubeSat_Constellation
• Il mio sito: https://www.alessandropezzali.it
• PezzaliAPP: https://www.pezzaliapp.com

Tutte le fonti dati sono pubbliche: NASA NeoWs, CNEOS Sentry/Fireball, CelesTrak (TLE), wheretheiss.at, NASA APOD/EPIC/GIBS. Niente API a pagamento, niente tracking, geolocation opt-in.
```

---

## Versione B — Build in public / tech storytelling

**Quando usarla:** se il pubblico target prevalente di quel giorno sono colleghi tech, dev frontend, PM e chi segue l'evoluzione di Claude Code / sviluppo AI-assisted. Più dettaglio architetturale.

### Testo (~1.770 caratteri)

```
Ho rilasciato MeteorWatch v1.1, una PWA divulgativa che aggrega in un'unica dashboard asteroidi NEO, bolidi, sciami meteorici, rientri atmosferici, posizione live della ISS e immagini della Terra dal satellite DSCOVR.

Qualche scelta tecnica che mi è piaciuta nel costruirla.

Stack: React 18 + Vite + TypeScript, TailwindCSS dark mode, Leaflet per le mappe 2D, satellite.js per i calcoli orbitali (propagazione SGP4, ground track, pass predictor con flag di visibilità a occhio nudo) — tutti lato client, nessun backend. Cache offline con idb-keyval + Workbox: l'app è installabile e i dati restano consultabili anche senza rete.

Le fonti sono solo pubbliche e gratuite: NASA NeoWs, CNEOS Sentry e Fireball, CelesTrak (TLE), wheretheiss.at, NASA APOD, EPIC e GIBS (tile satellitari WMTS — MODIS Terra, VIIRS, Black Marble). Nessuna API a pagamento, nessun tracking, geolocation rigorosamente opt-in.

Regola d'oro architetturale: MeteorWatch è la dashboard degli eventi, la sister app CubeSat Constellation è il viewer 3D delle orbite. Dove serve il 3D, MeteorWatch genera un deep-link col TLE in base64 e cede il palco. Niente codice duplicato.

Buona parte dello sviluppo l'ho fatto in coppia con Claude Code in modalità autonoma — 14 fasi, commit conventional, 36 unit test Vitest, GitHub Action su gh-pages. Onestamente: il modello scrive codice testato e disciplinato, ma la spina dorsale (vincoli legali, di costo zero, di scope, design system, regola d'oro vs. la sister app) resta una scelta umana esplicita. È uno strumento, non un autore.

🌐 https://www.alessandropezzali.it/MeteorWatch/
💻 https://github.com/pezzaliapp/MeteorWatch
🛰 https://pezzaliapp.github.io/CubeSat_Constellation/

#BuildInPublic #ReactJS #TypeScript #PWA #SpaceTech #ClaudeCode #OpenSource
```

### Hashtag (7)

`#BuildInPublic` `#ReactJS` `#TypeScript` `#PWA` `#SpaceTech` `#ClaudeCode` `#OpenSource`

### Screenshot consigliati (4)

1. **ISS Live** — mappa con ground track + marker ISS + tabella "prossimi 3 passaggi" con AOS/elev/durata e bottone `⤓ Esporta calendario .ics`. Dimostra il pass predictor.
2. **Earth Live** — toggle layer mappa visibile (`OSM / MODIS / VIIRS / NIGHT`) e terminatore polilinea + cerchietto giallo del subsolar point. Mostra l'integrazione GIBS.
3. **Home** — dashboard con le card sky-status, NEO ravvicinato, ultimo bolide, **APOD card** e **EPIC card** affiancate. Trasmette la varietà di fonti.
4. **Mobile bottom nav + lighthouse-style metrics overlay** *(opzionale)* — uno screenshot mobile con la BottomNav, eventualmente affiancato a uno snippet del bundle (`main 230 KB / leaflet 154 KB chunk separato`) per chi apprezza il dettaglio perf.

### First comment

```
Qualche numero per chi è curioso 👇
• Bundle: main JS 230 KB / 80 KB gzip (Leaflet in chunk separato, 44 KB gzip)
• 36 unit test Vitest (formatters, riskCalculator, sgp4Lite, moonPhase, sunCalc, dayNightTerminator…)
• Repo MIT: https://github.com/pezzaliapp/MeteorWatch
• CHANGELOG dettagliato: https://github.com/pezzaliapp/MeteorWatch/blob/main/CHANGELOG.md
• Architettura + scelte: https://github.com/pezzaliapp/MeteorWatch/blob/main/ANALISI_INIZIALE.md

Sister app per il 3D: https://pezzaliapp.github.io/CubeSat_Constellation/
```

---

## Versione C — Bilanciata *(consigliata per il profilo Alessandro Pezzali)*

**Quando usarla:** è la scelta di default per il pubblico misto LinkedIn (dev + designer + PM + appassionati). Apre con un'immagine evocativa, scende sul concreto in tre punti, chiude con due righe tecniche che catturano i tech-curious.

### Testo (~1.560 caratteri)

```
Stanotte sopra di te passeranno la Stazione Spaziale, qualche scia delle Liridi e probabilmente un asteroide a poche distanze lunari. Per saperlo non serve un dottorato: basta avere lo strumento giusto.

Ho rilasciato MeteorWatch v1.1, una PWA che mette in un colpo d'occhio cosa cade, passa o entra in atmosfera vicino alla Terra. È pensata per appassionati di cielo, studenti, insegnanti e divulgatori.

Le sezioni che mi divertono di più:
— Sky Tonight: fase lunare, crepuscoli, ISS visibile a occhio nudo, sciami attivi, NEO del giorno — calcolati sulla tua posizione (opt-in).
— Earth: ultime immagini di DSCOVR EPIC + tile satellitari NASA GIBS (MODIS, VIIRS, Black Marble) con terminatore giorno/notte.
— ISS Live: pass predictor 48h con export .ics da aggiungere al calendario.

Sotto il cofano: React + TypeScript, mappe Leaflet, calcoli orbitali con satellite.js lato client, cache offline. Tutte le fonti sono pubbliche e gratuite — NASA, JPL CNEOS, ESA, CelesTrak — citate in ogni sezione. È uno strumento divulgativo, non sostituisce i sistemi ufficiali di difesa planetaria.

Fa parte della mia serie PezzaliAPP — gemella di CubeSat Constellation, che si occupa invece della visualizzazione 3D delle orbite. L'ho costruita in autonomia, con il supporto di Claude Code per le fasi più ripetitive del lavoro.

🌐 https://www.alessandropezzali.it/MeteorWatch/
🛰 https://pezzaliapp.github.io/CubeSat_Constellation/

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
• Sister app 3D — CubeSat Constellation: https://github.com/pezzaliapp/CubeSat_Constellation
• Il resto della serie: https://www.pezzaliapp.com
• Sito personale: https://www.alessandropezzali.it

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

**Versione C — Bilanciata.** Centra il profilo Alessandro Pezzali: tecnico ma non solo per tecnici, divulgativo ma con la parte di codice riconoscibile. Le versioni A e B sono ottime come fallback per pubblicazioni successive (es. ripostare la stessa release a 7–10 giorni con angolazione diversa, evitando di sembrare lo stesso post).
