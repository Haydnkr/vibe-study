import { test, expect } from '@playwright/test';
import { gotoApp, seedStore, makeLeg, CITY, ALL_TRANSPORTS } from './helpers';

// ── F3a: 교통수단 필터로 경로 숨김 ────────────────────────────────
// 목적: 특정 교통수단 체크 해제 시 해당 폴리라인만 지도에서 사라지는지.
test('교통수단 필터를 해제하면 해당 경로만 숨겨진다', async ({ page }) => {
  await seedStore(page, {
    trips: [
      {
        id: 't1',
        title: '필터 테스트',
        legs: [
          makeLeg('l1', CITY.paris, CITY.london, 'plane'),
          makeLeg('l2', CITY.london, CITY.rome, 'train'),
        ],
      },
    ],
  });
  await gotoApp(page);
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(2);

  // 항공 해제 → plane leg 1개 숨김 → 1개 남음
  await page.locator('label').filter({ hasText: '항공' }).click();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1);

  // 다시 켜면 2개로 복귀
  await page.locator('label').filter({ hasText: '항공' }).click();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(2);
});

// ── F3b: 필터 최소 1개 강제 (FR-017 / AC-013) ────────────────────
// 목적: 체크된 교통수단이 1개만 남으면 그 체크박스는 해제 불가(disabled)임을 확인.
// 주의: REQUIREMENTS UC-005 문서("전부 해제=전체표시")와 다르게, 구현은 최소 1개를 강제한다.
test('마지막 1개 교통수단 체크박스는 해제할 수 없다', async ({ page }) => {
  await gotoApp(page);

  // walk만 남기고 나머지 5개 해제
  for (const t of ALL_TRANSPORTS.filter((x) => x !== 'walk')) {
    const label = { plane: '항공', train: '기차', car: '자동차', bus: '버스', ship: '선박' }[t]!;
    await page.locator('label').filter({ hasText: label }).click();
  }

  // 마지막 1개는 체크된 채 disabled → 해제 불가가 보장됨.
  const walk = page.getByRole('checkbox', { name: '도보' });
  await expect(walk).toBeChecked();
  await expect(walk).toBeDisabled();
  // 안내 툴팁(title) 노출 확인
  await expect(page.locator('label').filter({ hasText: '도보' })).toHaveAttribute(
    'title',
    '최소 1개 교통수단을 선택해야 합니다'
  );
});
