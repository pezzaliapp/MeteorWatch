export interface MeteorShower {
  code: string;
  name: { it: string; en: string };
  activeStart: string; // "MM-DD"
  activeEnd: string;
  peak: string;
  zhr: number;
  velocityKms: number;
  parent?: string;
  radiantRa: number; // hours
  radiantDec: number; // degrees
  tip: { it: string; en: string };
}

export const METEOR_SHOWERS: MeteorShower[] = [
  {
    code: 'QUA',
    name: { it: 'Quadrantidi', en: 'Quadrantids' },
    activeStart: '12-28',
    activeEnd: '01-12',
    peak: '01-04',
    zhr: 110,
    velocityKms: 41,
    parent: '2003 EH1',
    radiantRa: 15.3,
    radiantDec: 49.7,
    tip: {
      it: 'Sciame breve ma intenso. Il picco dura solo poche ore.',
      en: 'Short but intense shower. The peak lasts only a few hours.',
    },
  },
  {
    code: 'LYR',
    name: { it: 'Liridi', en: 'Lyrids' },
    activeStart: '04-16',
    activeEnd: '04-30',
    peak: '04-22',
    zhr: 18,
    velocityKms: 49,
    parent: 'C/1861 G1 Thatcher',
    radiantRa: 18.1,
    radiantDec: 33.4,
    tip: {
      it: 'Notte calma di primavera, frequenti scie persistenti.',
      en: 'Quiet spring night, often leaves persistent trails.',
    },
  },
  {
    code: 'ETA',
    name: { it: 'Eta Aquaridi', en: 'Eta Aquariids' },
    activeStart: '04-19',
    activeEnd: '05-28',
    peak: '05-06',
    zhr: 50,
    velocityKms: 66,
    parent: '1P/Halley',
    radiantRa: 22.4,
    radiantDec: -1.0,
    tip: {
      it: 'Migliori dall\'emisfero sud, prima dell\'alba.',
      en: 'Best seen from the southern hemisphere before dawn.',
    },
  },
  {
    code: 'PER',
    name: { it: 'Perseidi', en: 'Perseids' },
    activeStart: '07-17',
    activeEnd: '08-24',
    peak: '08-12',
    zhr: 100,
    velocityKms: 59,
    parent: '109P/Swift-Tuttle',
    radiantRa: 3.2,
    radiantDec: 58.0,
    tip: {
      it: 'Le “lacrime di San Lorenzo”. Estate, cielo scuro, stesi sull\'erba.',
      en: 'Summer favorite. Dark skies, lay back, look up.',
    },
  },
  {
    code: 'DRA',
    name: { it: 'Draconidi', en: 'Draconids' },
    activeStart: '10-06',
    activeEnd: '10-10',
    peak: '10-08',
    zhr: 10,
    velocityKms: 21,
    parent: '21P/Giacobini-Zinner',
    radiantRa: 17.5,
    radiantDec: 54.0,
    tip: {
      it: 'Possibili outburst rari. Velocità basse, scie lente.',
      en: 'Possible rare outbursts. Low speeds, slow trails.',
    },
  },
  {
    code: 'ORI',
    name: { it: 'Orionidi', en: 'Orionids' },
    activeStart: '10-02',
    activeEnd: '11-07',
    peak: '10-21',
    zhr: 20,
    velocityKms: 66,
    parent: '1P/Halley',
    radiantRa: 6.3,
    radiantDec: 15.5,
    tip: {
      it: 'Frammenti della cometa di Halley. Veloci e brillanti.',
      en: "Debris from Halley's Comet. Fast and bright.",
    },
  },
  {
    code: 'LEO',
    name: { it: 'Leonidi', en: 'Leonids' },
    activeStart: '11-06',
    activeEnd: '11-30',
    peak: '11-17',
    zhr: 15,
    velocityKms: 71,
    parent: '55P/Tempel-Tuttle',
    radiantRa: 10.2,
    radiantDec: 22.0,
    tip: {
      it: 'Storiche tempeste meteoriche ogni ~33 anni. Veloci.',
      en: 'Historic meteor storms every ~33 years. Fast.',
    },
  },
  {
    code: 'GEM',
    name: { it: 'Geminidi', en: 'Geminids' },
    activeStart: '12-04',
    activeEnd: '12-20',
    peak: '12-14',
    zhr: 150,
    velocityKms: 35,
    parent: '3200 Phaethon',
    radiantRa: 7.5,
    radiantDec: 32.0,
    tip: {
      it: 'Lo sciame più intenso dell\'anno, attivo già dalla sera.',
      en: 'The most intense shower of the year, visible from evening.',
    },
  },
  {
    code: 'URS',
    name: { it: 'Ursidi', en: 'Ursids' },
    activeStart: '12-17',
    activeEnd: '12-26',
    peak: '12-22',
    zhr: 10,
    velocityKms: 33,
    parent: '8P/Tuttle',
    radiantRa: 14.5,
    radiantDec: 75.0,
    tip: {
      it: 'Picco intorno al solstizio d\'inverno. Cielo molto a nord.',
      en: 'Peaks near the winter solstice. High northern radiant.',
    },
  },
];

export function isShowerActive(shower: MeteorShower, date = new Date()): boolean {
  const mmdd = `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  const start = shower.activeStart;
  const end = shower.activeEnd;
  if (start <= end) return mmdd >= start && mmdd <= end;
  return mmdd >= start || mmdd <= end;
}

export function daysToPeak(shower: MeteorShower, date = new Date()): number {
  const [m, d] = shower.peak.split('-').map(Number);
  const year = date.getUTCFullYear();
  let peak = new Date(Date.UTC(year, m - 1, d));
  if (peak.getTime() < date.getTime() - 86_400_000) {
    peak = new Date(Date.UTC(year + 1, m - 1, d));
  }
  return Math.round((peak.getTime() - date.getTime()) / 86_400_000);
}

export function activeShowers(date = new Date()): MeteorShower[] {
  return METEOR_SHOWERS.filter((s) => isShowerActive(s, date));
}

export function upcomingShowers(date = new Date(), within = 30): MeteorShower[] {
  return METEOR_SHOWERS.filter((s) => {
    const d = daysToPeak(s, date);
    return d >= 0 && d <= within && !isShowerActive(s, date);
  }).sort((a, b) => daysToPeak(a, date) - daysToPeak(b, date));
}
