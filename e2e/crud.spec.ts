import { test, expect } from '@playwright/test';
import { gotoApp, seedStore, makeLeg, CITY } from './helpers';

// ── F7: Trip 제목 수정 (⋮ → 편집) ────────────────────────────────
// 목적: TripActionMenu→편집 다이얼로그→저장이 사이드바에 즉시 반영되는지.
test('Trip 제목을 편집하면 즉시 반영된다', async ({ page }) => {
  await seedStore(page, { trips: [{ id: 't1', title: '수정 전 제목', legs: [] }] });
  await gotoApp(page);

  await page.getByRole('button', { name: '여행 작업 메뉴' }).click();
  await page.getByRole('menuitem', { name: '편집' }).click();

  const dlg = page.getByRole('dialog', { name: '여행 편집' });
  await dlg.getByLabel('제목').fill('수정 후 제목');
  await dlg.getByRole('button', { name: '저장' }).click();

  await expect(page.getByRole('heading', { name: '수정 후 제목' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '수정 전 제목' })).toHaveCount(0);
});

// ── F8: Trip cascade 삭제 (⋮ → 삭제 → 확인) ──────────────────────
// 목적: Leg를 가진 Trip 삭제 시 확인 다이얼로그가 Leg 수를 알리고, 확인 시 Trip+Leg가 모두 제거되는지.
test('Trip을 삭제하면 포함된 Leg와 함께 제거된다', async ({ page }) => {
  await seedStore(page, {
    trips: [
      {
        id: 't1',
        title: '삭제할 여행',
        legs: [
          makeLeg('l1', CITY.paris, CITY.london, 'plane'),
          makeLeg('l2', CITY.london, CITY.rome, 'train'),
        ],
      },
    ],
  });
  await gotoApp(page);
  await expect(page.getByText('2 Leg')).toBeVisible();

  await page.getByRole('button', { name: '여행 작업 메뉴' }).click();
  await page.getByRole('menuitem', { name: '삭제' }).click();

  const dlg = page.getByRole('dialog', { name: '여행 삭제 확인' });
  await expect(dlg.getByText(/Leg 2개/)).toBeVisible();
  await dlg.getByRole('button', { name: '삭제' }).click();

  // Trip 제거 → 빈 상태로 복귀
  await expect(page.getByRole('heading', { name: '삭제할 여행' })).toHaveCount(0);
  await expect(page.getByText('여행이 없습니다.')).toBeVisible();
  // 지도 폴리라인도 사라짐
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(0);
});
