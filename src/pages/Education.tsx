import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';

interface GlossaryEntry {
  term: string;
  it: string;
  en: string;
}

const GLOSSARY: GlossaryEntry[] = [
  { term: 'Meteoroide', it: 'Frammento di asteroide o cometa nello spazio (mm–m).', en: 'Asteroid/comet fragment in space (mm–m).' },
  { term: 'Meteora', it: 'Scia luminosa di un meteoroide che entra in atmosfera.', en: 'Luminous trail of a meteoroid entering the atmosphere.' },
  { term: 'Meteorite', it: 'Frammento sopravvissuto al passaggio atmosferico e arrivato a terra.', en: 'Fragment that survived atmospheric entry and reached the ground.' },
  { term: 'Bolide / Fireball', it: 'Meteora più brillante di Venere (≈ -4 mag o più).', en: 'Meteor brighter than Venus (≈ -4 mag or more).' },
  { term: 'Asteroide', it: 'Piccolo corpo roccioso del Sistema Solare.', en: 'Small rocky body of the Solar System.' },
  { term: 'Cometa', it: 'Corpo ghiacciato che sviluppa coma e coda avvicinandosi al Sole.', en: 'Icy body that develops coma and tail when near the Sun.' },
  { term: 'NEO', it: 'Near-Earth Object: orbita ravvicinata alla Terra (q < 1.3 AU).', en: 'Near-Earth Object: orbit close to Earth (q < 1.3 AU).' },
  { term: 'NEA / NEC', it: 'Near-Earth Asteroid / Near-Earth Comet.', en: 'Near-Earth Asteroid / Comet.' },
  { term: 'PHA', it: 'Potentially Hazardous Asteroid: NEO ≥ 140 m e MOID ≤ 0.05 AU.', en: 'Potentially Hazardous Asteroid: NEO ≥ 140 m, MOID ≤ 0.05 AU.' },
  { term: 'ZHR', it: 'Zenithal Hourly Rate: meteore/h con radiante allo zenit e cielo scurissimo.', en: 'Zenithal Hourly Rate: meteors/h with radiant at zenith and dark sky.' },
  { term: 'Radiante', it: 'Punto della sfera celeste da cui sembrano provenire le meteore.', en: 'Point on the sky from which meteors appear to radiate.' },
  { term: 'LD', it: 'Lunar Distance ≈ 384.400 km.', en: 'Lunar Distance ≈ 384,400 km.' },
  { term: 'AU', it: 'Astronomical Unit ≈ 149,6 milioni di km.', en: 'Astronomical Unit ≈ 149.6 million km.' },
  { term: 'Palermo Scale', it: 'Misura logaritmica del rischio di impatto.', en: 'Logarithmic impact risk measure.' },
  { term: 'Torino Scale', it: 'Scala 0–10 di rischio di impatto.', en: 'Impact risk scale, 0–10.' },
  { term: 'Yarkovsky', it: 'Forza non-gravitazionale dovuta a re-irraggiamento termico.', en: 'Non-gravitational force from thermal re-radiation.' },
  { term: 'BSTAR', it: 'Coefficiente di drag atmosferico nei TLE.', en: 'Atmospheric drag coefficient in TLEs.' },
  { term: 'TLE', it: 'Two-Line Element set: parametri orbitali.', en: 'Two-Line Element set: orbital parameters.' },
];

interface HistoryEntry {
  year: string;
  title: string;
  it: string;
  en: string;
}

const HISTORY: HistoryEntry[] = [
  {
    year: '−66 Myr',
    title: 'Chicxulub',
    it: "Asteroide di ~10 km nello Yucatán. Estinzione di massa K-Pg, fine dei dinosauri non aviani.",
    en: '~10 km asteroid in Yucatán. K-Pg mass extinction, end of non-avian dinosaurs.',
  },
  {
    year: '1908',
    title: 'Tunguska',
    it: 'Airburst sulla Siberia. ~10–15 Mt, 2000 km² di taiga abbattuta. Nessun cratere.',
    en: 'Siberian airburst. ~10–15 Mt, 2000 km² of taiga flattened. No crater.',
  },
  {
    year: '1947',
    title: 'Sikhote-Alin',
    it: 'Bolide di ferro in Russia, frammenti recuperati e crateri visibili.',
    en: 'Iron meteor in Russia, recovered fragments and visible craters.',
  },
  {
    year: '1969',
    title: 'Allende & Murchison',
    it: 'Due condriti carbonacee nel 1969, contenenti amminoacidi e materiale presolare.',
    en: 'Two carbonaceous chondrites in 1969, containing amino acids and presolar material.',
  },
  {
    year: '2013',
    title: 'Chelyabinsk',
    it: 'Bolide di ~20 m sopra gli Urali. ~440 kt, ~1500 feriti per le finestre rotte.',
    en: '~20 m fireball over the Urals. ~440 kt, ~1500 injured by shattered windows.',
  },
  {
    year: '2022',
    title: 'DART',
    it: 'NASA devia con successo l\'asteroide Dimorphos. Prima difesa planetaria attiva.',
    en: 'NASA successfully deflects asteroid Dimorphos. First active planetary defense test.',
  },
];

interface PipelineEntry {
  name: string;
  it: string;
  en: string;
  url: string;
}

const PIPELINE: PipelineEntry[] = [
  {
    name: 'Catalina Sky Survey',
    it: "Cerca NEO da Mt. Lemmon e Mt. Bigelow, Arizona.",
    en: 'Searches NEOs from Mt. Lemmon & Mt. Bigelow, Arizona.',
    url: 'https://catalina.lpl.arizona.edu/',
  },
  {
    name: 'Pan-STARRS',
    it: 'Survey hawaiiano per asteroidi e fenomeni transienti.',
    en: 'Hawaiian survey for asteroids and transients.',
    url: 'https://panstarrs.ifa.hawaii.edu/',
  },
  {
    name: 'ATLAS',
    it: 'Allerta precoce per impatti < 1 settimana.',
    en: 'Early warning for impacts < 1 week away.',
    url: 'https://atlas.fallingstar.com/',
  },
  {
    name: 'Vera C. Rubin Observatory',
    it: 'LSST 8.4 m, censimento del cielo dal Cile.',
    en: 'LSST 8.4 m, sky survey from Chile.',
    url: 'https://rubinobservatory.org/',
  },
  {
    name: 'NASA Planetary Defense',
    it: 'Coordinamento globale per la difesa planetaria.',
    en: 'Global coordination for planetary defense.',
    url: 'https://www.nasa.gov/planetarydefense',
  },
  {
    name: 'DART / Hera',
    it: 'Deviazione cinetica (DART) e follow-up ESA (Hera) su Dimorphos.',
    en: 'Kinetic deflection (DART) and ESA follow-up (Hera) on Dimorphos.',
    url: 'https://www.nasa.gov/planetarydefense/dart/',
  },
];

export default function Education() {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader title={t('education.title')} subtitle={t('education.subtitle')} />

      <Card title={t('education.glossary')}>
        <ul className="grid gap-2 md:grid-cols-2">
          {GLOSSARY.map((g) => (
            <li key={g.term} className="glass p-3">
              <div className="font-semibold text-cyan-glow">{g.term}</div>
              <div className="text-sm text-space-200">{language === 'it' ? g.it : g.en}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t('education.recognize')}>
        <ul className="space-y-2 text-sm text-space-200">
          <li>• {language === 'it' ? 'Crosta di fusione scura, opaca, sottile (1–2 mm).' : 'Dark, dull, thin fusion crust (1–2 mm).'}</li>
          <li>• {language === 'it' ? 'Densità superiore alla normale (di solito > 3 g/cm³).' : 'Higher than normal density (usually > 3 g/cm³).'}</li>
          <li>• {language === 'it' ? 'Spesso magnetico per la presenza di ferro-nichel.' : 'Often magnetic due to iron-nickel content.'}</li>
          <li>• {language === 'it' ? 'Niente bolle (non è scoria) e niente quarzo.' : 'No bubbles (not slag) and no quartz.'}</li>
          <li>• {language === 'it' ? 'Possibili "regmaglypts": piccole impronte digitali.' : 'Possible regmaglypts: small thumbprint-like indentations.'}</li>
        </ul>
      </Card>

      <Card title={t('education.history')}>
        <ol className="space-y-3">
          {HISTORY.map((h) => (
            <li key={h.title} className="flex gap-4">
              <span className="w-20 shrink-0 font-mono text-xs text-magenta-glow">{h.year}</span>
              <div>
                <div className="font-semibold">{h.title}</div>
                <div className="text-sm text-space-200">{language === 'it' ? h.it : h.en}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title={t('education.pipeline')}>
        <ul className="grid gap-2 md:grid-cols-2">
          {PIPELINE.map((p) => (
            <li key={p.name} className="glass p-3">
              <a className="font-semibold text-cyan-glow hover:underline" href={p.url} target="_blank" rel="noreferrer">
                {p.name} ↗
              </a>
              <div className="text-sm text-space-200">{language === 'it' ? p.it : p.en}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={t('education.sources')}>
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          <SourceLink href="https://cneos.jpl.nasa.gov/" label="NASA / JPL CNEOS" />
          <SourceLink href="https://www.lpi.usra.edu/meteor/" label="Meteoritical Bulletin DB" />
          <SourceLink href="https://celestrak.org/" label="CelesTrak" />
          <SourceLink href="https://www.imo.net/" label="International Meteor Organization" />
          <SourceLink href="https://api.nasa.gov/" label="NASA Open APIs" />
          <SourceLink href="https://neo.ssa.esa.int/" label="ESA NEO Coordination Centre" />
        </ul>
      </Card>
    </div>
  );
}

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        className="text-cyan-glow hover:underline"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {label} ↗
      </a>
    </li>
  );
}
