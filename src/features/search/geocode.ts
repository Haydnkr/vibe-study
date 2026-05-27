import type { City } from '@/features/trips/types';

const BASE = 'https://nominatim.openstreetmap.org/search';

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: { country?: string };
}

// 브라우저 fetch 는 User-Agent 헤더를 무시한다 (forbidden header).
// Nominatim 은 Referer 와 브라우저 UA 로 대신 식별하며, 호출 측은
// 디바운스 300ms (1 req/sec 제한) 를 반드시 준수해야 한다.
export async function searchCity(query: string): Promise<City[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${BASE}?q=${encodeURIComponent(trimmed)}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = (await res.json()) as NominatimResult[];
  return data.map((r) => ({
    name: r.display_name.split(',')[0].trim(),
    country: r.address?.country ?? '',
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}
