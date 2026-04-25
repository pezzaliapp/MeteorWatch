import { useMemo } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import FireballMap from '@/components/maps/FireballMap';
import type { FireballEvent } from '@/services/cneosFireballApi';

interface FamousFall {
  name: string;
  year: number;
  lat: number;
  lon: number;
  type: string;
  massKg?: number;
  description: { it: string; en: string };
}

const FAMOUS_FALLS: FamousFall[] = [
  {
    name: 'Hoba',
    year: -80000,
    lat: -19.5925,
    lon: 17.9333,
    type: 'IVB iron',
    massKg: 60_000,
    description: {
      it: "Il più grande meteorite intero conosciuto al mondo. Trovato in Namibia nel 1920.",
      en: 'The largest known intact meteorite in the world. Found in Namibia in 1920.',
    },
  },
  {
    name: 'Allende',
    year: 1969,
    lat: 26.9667,
    lon: -105.3167,
    type: 'CV3 carbonaceous chondrite',
    massKg: 2_000,
    description: {
      it: 'Cadde in Messico nel 1969. Una delle pietre di Rosetta della cosmochimica moderna.',
      en: 'Fell in Mexico in 1969. A Rosetta Stone of modern cosmochemistry.',
    },
  },
  {
    name: 'Chelyabinsk',
    year: 2013,
    lat: 54.8,
    lon: 61.1,
    type: 'LL5 ordinary chondrite',
    massKg: 654,
    description: {
      it: 'Il bolide del 15 febbraio 2013, energia stimata ~440 kt. Frammenti recuperati nel lago Chebarkul.',
      en: 'The 15 Feb 2013 fireball, estimated ~440 kt. Fragments recovered in Lake Chebarkul.',
    },
  },
  {
    name: 'Sikhote-Alin',
    year: 1947,
    lat: 46.16,
    lon: 134.65,
    type: 'IIAB iron',
    massKg: 23_000,
    description: {
      it: 'Cadde in Russia il 12 febbraio 1947. Crateri visibili e migliaia di frammenti.',
      en: 'Fell in Russia on 12 Feb 1947. Visible craters and thousands of fragments.',
    },
  },
  {
    name: 'Tunguska',
    year: 1908,
    lat: 60.886,
    lon: 101.894,
    type: 'airburst',
    description: {
      it: "L'evento del 30 giugno 1908. Un airburst di ~10–15 Mt rase al suolo 2000 km² di taiga senza lasciare crateri.",
      en: 'The 30 June 1908 event. A ~10–15 Mt airburst flattened 2000 km² of taiga with no crater.',
    },
  },
  {
    name: 'Murchison',
    year: 1969,
    lat: -36.62,
    lon: 145.2,
    type: 'CM2 carbonaceous chondrite',
    massKg: 100,
    description: {
      it: "Caduto in Australia. Contiene amminoacidi e composti organici prebiotici.",
      en: 'Fell in Australia. Contains amino acids and prebiotic organic compounds.',
    },
  },
  {
    name: 'Peekskill',
    year: 1992,
    lat: 41.28,
    lon: -73.92,
    type: 'H6 chondrite',
    massKg: 12.4,
    description: {
      it: 'Famoso per aver colpito una Chevy Malibu del 1980 nel New York. Filmato da decine di videocamere.',
      en: 'Famous for hitting a 1980 Chevy Malibu in New York. Filmed by dozens of camcorders.',
    },
  },
  {
    name: 'Chicxulub',
    year: -66_000_000,
    lat: 21.4,
    lon: -89.516,
    type: 'impactor',
    description: {
      it: "L'asteroide della fine del Cretaceo. Cratere di ~180 km nello Yucatán.",
      en: 'The end-Cretaceous asteroid. ~180 km crater in Yucatán.',
    },
  },
];

function asEvents(falls: FamousFall[]): FireballEvent[] {
  return falls.map((f) => ({
    date: `${f.year}`,
    epochMs: 0,
    energyKt: f.massKg ? Math.log10(f.massKg) : 5,
    impactEnergyJ: 0,
    lat: f.lat,
    lon: f.lon,
  }));
}

export default function Meteorites() {
  const { t, language } = useTranslation();
  const events = useMemo(() => asEvents(FAMOUS_FALLS), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('meteorites.title')}
        subtitle={t('meteorites.subtitle')}
        source="Meteoritical Bulletin Database"
        action={
          <a
            className="btn-primary text-xs"
            href="https://www.lpi.usra.edu/meteor/"
            target="_blank"
            rel="noreferrer"
          >
            {t('meteorites.linkBulletin')}
          </a>
        }
      />

      <Card title={t('meteorites.famousFalls')}>
        <FireballMap events={events} height={340} />
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {FAMOUS_FALLS.map((f) => (
            <li key={f.name} className="glass p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-space-50">{f.name}</span>
                <Badge tone="info">{f.year > 0 ? f.year : `${Math.abs(f.year).toLocaleString()} BCE`}</Badge>
                <Badge tone="magenta">{f.type}</Badge>
                {f.massKg && (
                  <span className="label">{f.massKg.toLocaleString()} kg</span>
                )}
              </div>
              <p className="mt-2 text-sm text-space-200">{f.description[language]}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t('meteorites.classes')}>
        <ul className="grid gap-3 md:grid-cols-2">
          <ClassRow title={t('meteorites.chondrite')} description={t('meteorites.chondriteDesc')} />
          <ClassRow title={t('meteorites.achondrite')} description={t('meteorites.achondriteDesc')} />
          <ClassRow title={t('meteorites.iron')} description={t('meteorites.ironDesc')} />
          <ClassRow title={t('meteorites.pallasite')} description={t('meteorites.pallasiteDesc')} />
        </ul>
      </Card>
    </div>
  );
}

function ClassRow({ title, description }: { title: string; description: string }) {
  return (
    <li className="glass p-3">
      <div className="font-semibold text-cyan-glow">{title}</div>
      <div className="text-sm text-space-200">{description}</div>
    </li>
  );
}
