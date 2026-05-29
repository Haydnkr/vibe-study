import { test, expect } from '@playwright/test';
import { gotoApp, mockNominatim, createTrip } from './helpers';

// ── T1 (F1): Trip 생성 스모크 ─────────────────────────────────────
// 목적: 앱 진입 + 상태변경 + 렌더 파이프라인이 살아있음을 보장.
test('새 여행을 만들면 사이드바에 추가되고 자동 선택된다', async ({ page }) => {
  await gotoApp(page);

  await page.getByRole('button', { name: '새 여행 추가' }).click();
  const dlg = page.getByRole('dialog', { name: '새 여행 만들기' });
  await expect(dlg).toBeVisible();
  await dlg.getByLabel('제목').fill('제주 한 바퀴');
  await dlg.getByRole('button', { name: '저장' }).click();

  await expect(page.getByRole('heading', { name: '제주 한 바퀴' })).toBeVisible();
  await expect(page.getByText('0 Leg')).toBeVisible();
  // 자동 선택 → border-ink 강조
  await expect(page.locator('section').filter({ hasText: '제주 한 바퀴' })).toHaveClass(/border-ink/);
});

// ── T2 (F2): Leg 생성 → 지도 마커+폴리라인 (Nominatim 모킹) ────────
// 목적: 도시검색→선택→일시→교통수단→저장이 목록과 지도에 end-to-end 반영되는지.
test('Leg를 추가하면 목록과 지도에 경로가 그려진다', async ({ page }) => {
  await mockNominatim(page);
  await gotoApp(page);
  await createTrip(page, '일본 여행');

  await page.getByRole('button', { name: '+ Leg 추가' }).click();
  const leg = page.getByRole('dialog', { name: 'Leg 추가' });
  await expect(leg).toBeVisible();

  await leg.getByLabel('출발 도시').fill('Tokyo');
  await leg.getByRole('button', { name: /Tokyo/ }).click();
  await leg.getByLabel('도착 도시').fill('Osaka');
  await leg.getByRole('button', { name: /Osaka/ }).click();

  await leg.getByLabel('출발 일시').fill('2026-06-01T09:00');
  await leg.getByLabel('도착 일시').fill('2026-06-01T10:15');
  await leg.getByRole('button', { name: '항공' }).click();
  await leg.getByRole('button', { name: '저장' }).click();

  // 목록 반영
  await expect(page.getByText('1 Leg')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Tokyo' })).toBeVisible();

  // 지도 반영: 폴리라인 1개, 마커 2개
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1);
  await expect(page.locator('.travel-map-city-marker')).toHaveCount(2);
});

// ── T3 (F4): localStorage 영속성 ──────────────────────────────────
// 목적: 변경 후 새로고침해도 persist 미들웨어가 데이터를 보존하는지.
test('새로고침해도 추가한 여행이 유지된다', async ({ page }) => {
  await gotoApp(page);
  await createTrip(page, '영속성 테스트');
  await expect(page.getByRole('heading', { name: '영속성 테스트' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('heading', { name: '영속성 테스트' })).toBeVisible();
  await expect(page.getByText('여행이 없습니다.')).toHaveCount(0);
});
