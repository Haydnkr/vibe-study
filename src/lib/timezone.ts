// @ts-expect-error — tz-lookup has no published types
import tzLookup from 'tz-lookup';
import type { City } from '@/features/trips/types';

/**
 * Derive IANA timezone from coordinates.
 * Falls back to "UTC" if lookup throws (defensive — coords out of range etc.).
 */
export function deriveTimezone(lat: number, lng: number): string {
  try {
    return tzLookup(lat, lng);
  } catch {
    return 'UTC';
  }
}

/**
 * Ensure a City has a timezone. Returns the City with `timezone` populated.
 * Idempotent — if timezone already set, returned unchanged.
 *
 * Call this at every City entry point: creation, search-result selection, import.
 */
export function ingestCity(city: City): City {
  if (city.timezone) return city;
  return { ...city, timezone: deriveTimezone(city.lat, city.lng) };
}

/**
 * Resolve a City's timezone, deriving lazily if missing.
 * Use this at read sites where City may not have been ingested yet.
 */
export function resolveTimezone(city: City): string {
  return city.timezone ?? deriveTimezone(city.lat, city.lng);
}

/**
 * Convert a wall-clock local time (e.g., from <input type="datetime-local">)
 * in a given IANA timezone to a UTC ISO 8601 string.
 *
 * @param localISO  e.g., "2026-05-27T10:00" (no Z suffix, treated as wall clock)
 * @param ianaTz    e.g., "Asia/Seoul"
 * @returns UTC ISO string, e.g., "2026-05-27T01:00:00.000Z"
 */
export function localToUtc(localISO: string, ianaTz: string): string {
  // Parse wall-clock components from input
  const [datePart, timePart = '00:00'] = localISO.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);

  // First guess: treat the wall-clock as UTC and compute what the formatter
  // would show for that instant in ianaTz. The delta tells us the offset.
  const guess = Date.UTC(year, month - 1, day, hour, minute, second);
  const offsetMin = getTimezoneOffsetMinutes(guess, ianaTz);
  // ianaTz is `offsetMin` minutes ahead of UTC at this instant.
  // So local wall-clock at ianaTz corresponds to UTC = guess - offsetMin.
  const utcMs = guess - offsetMin * 60_000;
  return new Date(utcMs).toISOString();
}

/**
 * Get the offset (in minutes, positive = ahead of UTC) of `ianaTz` at the
 * given UTC instant. Uses Intl.DateTimeFormat to handle DST automatically.
 */
function getTimezoneOffsetMinutes(utcMs: number, ianaTz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  // hour can come back as "24" from some implementations — normalize.
  const hour = get('hour') % 24;
  const localAsUtcMs = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    hour,
    get('minute'),
    get('second')
  );
  return Math.round((localAsUtcMs - utcMs) / 60_000);
}

/**
 * Format a UTC ISO timestamp as a wall-clock string in the city's local timezone.
 * Uses Intl.DateTimeFormat with DST awareness.
 */
export function formatLocal(
  utcISO: string,
  city: City,
  opts: { dateOnly?: boolean; withTzLabel?: boolean } = {}
): string {
  const tz = resolveTimezone(city);
  const date = new Date(utcISO);
  const fmt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(opts.dateOnly ? {} : { hour: '2-digit', minute: '2-digit', hour12: false }),
  });
  const main = fmt.format(date);
  if (!opts.withTzLabel) return main;
  return `${main} (${tzAbbreviation(tz, date)})`;
}

/**
 * Short timezone abbreviation (e.g., "KST", "CEST") at a given instant.
 */
export function tzAbbreviation(ianaTz: string, at: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTz,
    timeZoneName: 'short',
  }).formatToParts(at);
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ianaTz;
}
