import type { SatPass } from './passPredictor';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toICSDate(ms: number): string {
  const d = new Date(ms);
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export function passesToIcs(passes: SatPass[], satName = 'ISS'): string {
  const now = toICSDate(Date.now());
  const events = passes
    .map((p, i) => {
      const summary = `${satName} pass — max ${p.maxElDeg.toFixed(0)}°${p.visible ? ' (visible)' : ''}`;
      const description = `Max elevation: ${p.maxElDeg.toFixed(1)}°\\nDuration: ${p.durationSec}s\\nStart az: ${p.startAzDeg.toFixed(0)}°\\nEnd az: ${p.endAzDeg.toFixed(0)}°`;
      return [
        'BEGIN:VEVENT',
        `UID:meteorwatch-${satName}-${p.aos}-${i}@pezzaliapp.com`,
        `DTSTAMP:${now}`,
        `DTSTART:${toICSDate(p.aos)}`,
        `DTEND:${toICSDate(p.los)}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        'END:VEVENT',
      ].join('\r\n');
    })
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PezzaliAPP//MeteorWatch//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
