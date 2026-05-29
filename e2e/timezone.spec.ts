import { test, expect } from '@playwright/test';
import { gotoApp, seedStore, makeLeg, CITY } from './helpers';

// ── F12: UTC 저장 → 도시 현지 시간대로 표시 (FR-013 / AC-010) ─────
// 목적: departedAt(UTC)이 출발 도시 IANA 시간대로 변환되어 표시되는지.
// 검증 트릭: 2026-06-01T16:30Z 는 Asia/Seoul(UTC+9)에서 2026-06-02 01:30 → 날짜가 하루 넘어간다.
//           LegCard가 06.02(서울 기준)를 보이면 변환이 적용된 것 (UTC 그대로면 06.01).
test('LegCard 날짜는 출발 도시 현지 시간대로 변환되어 표시된다', async ({ page }) => {
  await seedStore(page, {
    trips: [
      {
        id: 't1',
        title: '시간대 여행',
        legs: [
          makeLeg(
            'l1',
            CITY.seoul,
            CITY.tokyo,
            'plane',
            '2026-06-01T16:30:00.000Z', // Seoul 기준 06-02 01:30
            '2026-06-01T18:00:00.000Z'
          ),
        ],
      },
    ],
  });
  await gotoApp(page);

  const card = page.getByRole('article').filter({ hasText: 'Seoul' });
  await expect(card).toBeVisible();
  // ko-KR dateOnly → "2026. 06. 02." 형태. 서울 변환 결과(02)가 보여야 하고 UTC(01)이면 안 됨.
  await expect(card).toContainText(/2026\.\s*06\.\s*02/);
});
