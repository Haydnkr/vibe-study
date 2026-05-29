import { test, expect } from '@playwright/test';
import { gotoApp, seedStore, makeLeg, CITY } from './helpers';

// ── F11: 여행 재생 → 시계 패널 표시 후 자동 종료 ─────────────────
// 목적: ▶ 재생 시 시계 패널(role=status, "이동 중")이 뜨고 버튼이 "중지"로 바뀌며,
//        leg당 2.5s 후 자동으로 멈추는지.
test('여행을 재생하면 시계 패널이 뜨고 끝나면 자동 종료된다', async ({ page }) => {
  await seedStore(page, {
    trips: [
      {
        id: 't1',
        title: '재생 여행',
        legs: [makeLeg('l1', CITY.tokyo, CITY.seoul, 'plane')],
      },
    ],
  });
  await gotoApp(page);

  await page.getByRole('button', { name: '재생' }).click();

  // 시계 패널 표시 + 버튼 상태 전환
  await expect(page.getByText('이동 중')).toBeVisible();
  await expect(page.getByText(/Leg 1 \/ 1/)).toBeVisible();
  await expect(page.getByRole('button', { name: '중지' })).toBeVisible();

  // leg 1개 = 2.5s 후 자동 종료 → 버튼이 다시 "재생"으로
  await expect(page.getByRole('button', { name: '재생' })).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('이동 중')).toHaveCount(0);
});
