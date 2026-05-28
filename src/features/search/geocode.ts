/**
 * Nominatim geocoding wrapper.
 *
 * Constraints (REQUIREMENTS NFR-006, CLAUDE.md):
 * - 1 req/sec limit → 300ms debounce at call site
 * - User-Agent header required: "travel-map-mvp/1.0"
 * - accept-language=en forced (D7 group-key stability)
 */

export interface GeocodeResult {
  name: string;
  country: string;
  lat: number;
  lng: number;
  /** Raw Nominatim display_name for reference */
  displayName: string;
}

const ENDPOINT = 'https://nominatim.openstreetmap.org/search';

/**
 * Search cities by name. Returns up to 5 results.
 * Throws on network error; resolves with [] on no match.
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (!q) return [];
  const url = new URL(ENDPOINT);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: {
      'Accept-Language': 'en',
      // Note: browser fetch ignores User-Agent header, but we set it for completeness.
      'User-Agent': 'travel-map-mvp/1.0',
    },
    signal,
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const raw = (await res.json()) as unknown;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((row): GeocodeResult | null => {
      if (!row || typeof row !== 'object') return null;
      const r = row as Record<string, unknown>;
      const lat = parseFloat(String(r.lat ?? ''));
      const lng = parseFloat(String(r.lon ?? ''));
      if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
      const addr = (r.address ?? {}) as Record<string, unknown>;
      const displayName = typeof r.display_name === 'string' ? r.display_name : '';
      const fallbackName =
        typeof r.name === 'string' && r.name
          ? r.name
          : displayName.split(',')[0]?.trim() ?? 'Unknown';
      const name =
        (addr.city as string | undefined) ??
        (addr.town as string | undefined) ??
        (addr.village as string | undefined) ??
        (addr.hamlet as string | undefined) ??
        (addr.county as string | undefined) ??
        fallbackName;
      const country = (addr.country as string | undefined) ?? '';
      return { name, country, lat, lng, displayName };
    })
    .filter((r): r is GeocodeResult => r !== null);
}
