import type { Page } from '@playwright/test';

/**
 * Nominatim 결정적 모킹.
 * geocode.ts는 `lat`/`lon`(문자열 허용) + `address.city`/`address.country` + `display_name`를 파싱한다.
 */
export async function mockNominatim(page: Page) {
  const db: Record<string, unknown> = {
    Tokyo: {
      lat: '35.6762',
      lon: '139.6503',
      display_name: 'Tokyo, Japan',
      address: { city: 'Tokyo', country: 'Japan' },
    },
    Osaka: {
      lat: '34.6937',
      lon: '135.5023',
      display_name: 'Osaka, Osaka Prefecture, Japan',
      address: { city: 'Osaka', country: 'Japan' },
    },
  };
  await page.route('**/nominatim.openstreetmap.org/search**', (route) => {
    const q = new URL(route.request().url()).searchParams.get('q')?.trim() ?? '';
    const key = Object.keys(db).find((k) => q.toLowerCase().startsWith(k.toLowerCase()));
    route.fulfill({ json: key ? [db[key]] : [] });
  });
}

/** 빈 상태에서 앱 열기 (Playwright 기본 컨텍스트 격리로 localStorage는 이미 비어 있음). */
export async function gotoApp(page: Page) {
  await page.goto('/app');
}

/** 헤더 "+ 여행"으로 Trip 하나 생성. */
export async function createTrip(page: Page, title: string) {
  await page.getByRole('button', { name: '새 여행 추가' }).click();
  const dlg = page.getByRole('dialog', { name: '새 여행 만들기' });
  await dlg.getByLabel('제목').fill(title);
  await dlg.getByRole('button', { name: '저장' }).click();
}

// ── 시드 유틸 ────────────────────────────────────────────────────
// zustand persist 포맷({ state, version })으로 localStorage를 미리 채운다.
// addInitScript는 페이지 스크립트보다 먼저 실행되므로 앱이 이 상태로 hydrate된다.

export const ALL_TRANSPORTS = ['plane', 'train', 'car', 'bus', 'ship', 'walk'] as const;

export const CITY = {
  paris: { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  london: { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  rome: { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, timezone: 'Europe/Rome' },
  seoul: { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978, timezone: 'Asia/Seoul' },
  tokyo: { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
} as const;

type SeedCity = { name: string; country: string; lat: number; lng: number; timezone?: string };

export function makeLeg(
  id: string,
  from: SeedCity,
  to: SeedCity,
  transport: (typeof ALL_TRANSPORTS)[number],
  departedAt = '2026-06-01T00:00:00.000Z',
  arrivedAt = '2026-06-01T02:00:00.000Z'
) {
  return { id, from, to, transport, departedAt, arrivedAt };
}

interface SeedState {
  trips: unknown[];
  categories?: unknown[];
  selectedTripId?: string;
}

/** goto 이전에 호출할 것. */
export async function seedStore(page: Page, state: SeedState) {
  const payload = {
    state: {
      categories: [],
      selectedTripId: (state.trips[0] as { id?: string })?.id,
      filterTransports: [...ALL_TRANSPORTS],
      ...state,
    },
    version: 1,
  };
  await page.addInitScript((p) => {
    localStorage.setItem('travel-map-store', JSON.stringify(p));
  }, payload);
}
