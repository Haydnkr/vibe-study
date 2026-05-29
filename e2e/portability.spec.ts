import { test, expect } from '@playwright/test';
import { gotoApp, createTrip } from './helpers';

// ── F5: JSON Export → Import(덮어쓰기) 라운드트립 ─────────────────
// 목적: Export한 파일을 Import하면 기존 trips가 "완전히 교체"되는지(병합 X).
test('Export한 파일을 Import하면 기존 데이터를 덮어쓴다', async ({ page }, testInfo) => {
  await gotoApp(page);
  await createTrip(page, '원본 여행');

  // Export → 다운로드 캡처 → 디스크 저장
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'JSON 내보내기' }).click(),
  ]);
  const exportPath = testInfo.outputPath('export.json');
  await download.saveAs(exportPath);

  // 다른 여행 추가 (이제 2개) → 곧 덮어써질 대상
  await createTrip(page, '덮어쓸 여행');
  await expect(page.getByRole('heading', { name: '덮어쓸 여행' })).toBeVisible();

  // Import (hidden input에 직접 파일 주입)
  await page.locator('input[type="file"]').setInputFiles(exportPath);

  // 덮어쓰기 확인 다이얼로그
  const dlg = page.getByRole('dialog', { name: 'Import 확인' });
  await expect(dlg.getByRole('heading', { name: '기존 데이터를 덮어쓸까요?' })).toBeVisible();
  await dlg.getByRole('button', { name: '덮어쓰기' }).click();

  // 결과: 원본만 남고 "덮어쓸 여행"은 사라짐
  await expect(page.getByRole('heading', { name: '원본 여행' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '덮어쓸 여행' })).toHaveCount(0);
});

// ── F6: 잘못된 JSON Import → 원자적 거부 (FR-018 / AC-014) ────────
// 목적: 검증 실패 시 store를 건드리지 않고 에러를 표시하는지(확인 다이얼로그도 뜨지 않음).
test('유효하지 않은 JSON은 거부되고 기존 데이터가 유지된다', async ({ page }) => {
  await gotoApp(page);
  await createTrip(page, '유지될 여행');

  // transport가 enum 밖("rocket") → validateLeg에서 거부
  const badJson = JSON.stringify({
    schemaVersion: 1,
    trips: [
      {
        id: 't1',
        title: '나쁜 여행',
        legs: [
          {
            id: 'l1',
            transport: 'rocket',
            departedAt: '2026-06-01T00:00:00Z',
            arrivedAt: '2026-06-01T02:00:00Z',
            from: { name: 'A', country: 'X', lat: 0, lng: 0 },
            to: { name: 'B', country: 'Y', lat: 1, lng: 1 },
          },
        ],
      },
    ],
    categories: [],
  });

  await page.locator('input[type="file"]').setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from(badJson),
  });

  // 거부 안내(role=status) + 확인 다이얼로그 미표시 + 기존 데이터 유지
  await expect(page.getByText(/Import 거부/)).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Import 확인' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '유지될 여행' })).toBeVisible();
});

// ── 보안: Category color에 HTML 주입 시도하는 Import는 거부된다 ───
// color는 일부 경로에서 HTML(divIcon)로 삽입되므로 안전한 색 형식만 허용.
test('Category color에 HTML 주입 페이로드가 있으면 Import가 거부된다', async ({ page }) => {
  await gotoApp(page);
  await createTrip(page, '유지될 여행');

  const xssJson = JSON.stringify({
    schemaVersion: 1,
    trips: [],
    categories: [{ id: 'c1', name: '나쁨', color: 'red"></div><img src=x onerror=alert(1)>' }],
  });

  await page.locator('input[type="file"]').setInputFiles({
    name: 'xss.json',
    mimeType: 'application/json',
    buffer: Buffer.from(xssJson),
  });

  await expect(page.getByText(/Import 거부/)).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Import 확인' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '유지될 여행' })).toBeVisible();
});
