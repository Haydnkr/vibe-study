import { test, expect } from '@playwright/test';
import { gotoApp, seedStore, makeLeg, CITY } from './helpers';

/**
 * mvp.spec.ts — UC-004 / AC-004: Leg 수정·삭제
 * (이전까지 UI 미연결이라 미커버였던 흐름. 이번에 LegCard 편집/삭제 버튼 + LegDeleteConfirm 구현으로 추가)
 *
 * ── Locator 레퍼런스 ────────────────────────────────────────────
 *  Leg 카드           : page.getByRole('article').filter({ hasText: '<도시명>' })
 *  Leg 편집 버튼      : <card>.getByRole('button', { name: 'Leg 편집' })
 *  Leg 삭제 버튼      : <card>.getByRole('button', { name: 'Leg 삭제' })
 *  Leg 편집 다이얼로그 : page.getByRole('dialog', { name: 'Leg 편집' })
 *  출발/도착 일시      : <dialog>.getByLabel('출발 일시' | '도착 일시')
 *  교통수단 토글       : <dialog>.getByRole('button', { name: '항공'|'기차'|... })
 *  저장 버튼          : <dialog>.getByRole('button', { name: '저장' })
 *  Leg 삭제 확인       : page.getByRole('dialog', { name: 'Leg 삭제 확인' })
 *  확인 삭제 버튼      : <confirm>.getByRole('button', { name: '삭제' })
 * ────────────────────────────────────────────────────────────────
 */

const seedTwoLegTrip = {
  trips: [
    {
      id: 't1',
      title: 'MVP 여행',
      legs: [
        makeLeg('l1', CITY.paris, CITY.london, 'plane', '2026-06-01T00:00:00.000Z'),
        makeLeg('l2', CITY.london, CITY.rome, 'train', '2026-06-03T00:00:00.000Z'),
      ],
    },
  ],
};

// ── AC-004 (수정): Leg 편집 → 지도/목록 즉시 반영 ────────────────
test('Leg를 편집하면 변경 내용이 목록과 지도에 즉시 반영된다', async ({ page }) => {
  await seedStore(page, seedTwoLegTrip);
  await gotoApp(page);

  const parisCard = page.getByRole('article').filter({ hasText: 'Paris' });
  await expect(parisCard).toBeVisible();
  // 편집 전 날짜 (Paris 현지 2026.06.01)
  await expect(parisCard).toContainText(/2026\.\s*06\.\s*01/);

  await parisCard.getByRole('button', { name: 'Leg 편집' }).click();

  const dlg = page.getByRole('dialog', { name: 'Leg 편집' });
  await expect(dlg).toBeVisible();
  // 기존 값이 채워져 있어야 함 (출발 도시 입력값)
  await expect(dlg.getByLabel('출발 도시')).toHaveValue(/Paris/);

  // 출발 일시를 12/25로 변경 후 저장
  await dlg.getByLabel('출발 일시').fill('2026-12-25T09:00');
  await dlg.getByRole('button', { name: '저장' }).click();

  // 목록 카드 날짜가 갱신됨 (06.01 → 12.25)
  await expect(parisCard).toContainText(/2026\.\s*12\.\s*25/);
  await expect(parisCard).not.toContainText(/2026\.\s*06\.\s*01/);
  // Leg 수는 그대로, 지도 폴리라인도 그대로 2개
  await expect(page.getByText('2 Leg')).toBeVisible();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(2);
});

// ── AC-004 (삭제): Leg 삭제 → 확인 다이얼로그 → 제거 ─────────────
test('Leg를 삭제하면 확인 후 목록과 지도에서 제거된다', async ({ page }) => {
  await seedStore(page, seedTwoLegTrip);
  await gotoApp(page);
  await expect(page.getByText('2 Leg')).toBeVisible();
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(2);

  const parisCard = page.getByRole('article').filter({ hasText: 'Paris' });
  await parisCard.getByRole('button', { name: 'Leg 삭제' }).click();

  const confirm = page.getByRole('dialog', { name: 'Leg 삭제 확인' });
  await expect(confirm.getByText('Paris → London')).toBeVisible();
  await confirm.getByRole('button', { name: '삭제' }).click();

  // Paris 구간 제거: 1 Leg 남음, Paris 카드 사라짐, London → Rome 잔존
  await expect(page.getByText('1 Leg')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Paris' })).toHaveCount(0);
  await expect(page.getByRole('article').filter({ hasText: 'Rome' })).toBeVisible();
  // 지도 폴리라인 2 → 1
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1);
});

// ── 삭제 취소 시 아무것도 지워지지 않음 (AC-004 Alternative Flow) ──
test('Leg 삭제 확인 다이얼로그에서 취소하면 변경이 없다', async ({ page }) => {
  await seedStore(page, seedTwoLegTrip);
  await gotoApp(page);

  const parisCard = page.getByRole('article').filter({ hasText: 'Paris' });
  await parisCard.getByRole('button', { name: 'Leg 삭제' }).click();

  const confirm = page.getByRole('dialog', { name: 'Leg 삭제 확인' });
  await confirm.getByRole('button', { name: '취소' }).click();

  await expect(confirm).toHaveCount(0);
  await expect(page.getByText('2 Leg')).toBeVisible();
  await expect(parisCard).toBeVisible();
});
