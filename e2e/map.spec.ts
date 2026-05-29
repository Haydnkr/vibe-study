import { test, expect } from '@playwright/test';
import { gotoApp, seedStore, makeLeg, CITY } from './helpers';

// ── F9: 같은 도시 다중 방문 → 마커 1개로 합치고 팝업에 누적 (FR-016 / AC-012) ──
test('같은 도시를 여러 번 방문해도 마커는 1개이고 팝업에 방문이 누적된다', async ({ page }) => {
  // Paris를 3번 등장시킨다: Paris→London, London→Paris, Paris→Rome
  await seedStore(page, {
    trips: [
      {
        id: 't1',
        title: '파리 경유 여행',
        legs: [
          makeLeg('l1', CITY.paris, CITY.london, 'plane'),
          makeLeg('l2', CITY.london, CITY.paris, 'train'),
          makeLeg('l3', CITY.paris, CITY.rome, 'plane'),
        ],
      },
    ],
  });
  await gotoApp(page);

  // 고유 도시 3개(Paris, London, Rome) → 마커 3개 (Paris 중복 합쳐짐)
  const markers = page.locator('.travel-map-city-marker');
  await expect(markers).toHaveCount(3);

  // 마커들을 돌며 Paris 팝업을 찾는다 (Leaflet 마커 DOM 순서는 위도 기반이라 비결정적)
  const count = await markers.count();
  let parisVisits = 0;
  for (let i = 0; i < count; i++) {
    await markers.nth(i).click();
    const popup = page.locator('.leaflet-popup-content');
    await expect(popup).toBeVisible();
    const text = await popup.innerText();
    if (text.includes('Paris')) {
      parisVisits = await popup.locator('li').count();
      break;
    }
  }
  // Paris는 depart(l1)+arrive(l2)+depart(l3) = 3회 방문
  expect(parisVisits).toBe(3);
});

// ── F10: 폴리라인 색 = Category 색, 미지정 시 #888888 폴백 (FR-021 / AC-015·016) ──
test('폴리라인 색은 Category 색을 따르고 없으면 회색으로 폴백된다', async ({ page }) => {
  await seedStore(page, {
    categories: [{ id: 'c1', name: '휴가', color: '#ff0000' }],
    trips: [
      {
        id: 't1',
        title: '카테고리 있음',
        categoryId: 'c1',
        legs: [makeLeg('l1', CITY.paris, CITY.london, 'plane')],
      },
      {
        id: 't2',
        title: '카테고리 없음',
        legs: [makeLeg('l2', CITY.rome, CITY.seoul, 'ship')],
      },
    ],
  });
  await gotoApp(page);

  // 전체 2개 폴리라인 중: 빨강 1, 중립회색 1
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(2);
  await expect(page.locator('.leaflet-overlay-pane path[stroke="#ff0000"]')).toHaveCount(1);
  await expect(page.locator('.leaflet-overlay-pane path[stroke="#888888"]')).toHaveCount(1);
});
