## 1. 사전 정비 (의존성 / 모델 / 제약문)

- [x] 1.1 `tz-lookup` 의존성 추가 (`npm install tz-lookup`)
- [x] 1.2 검증 라이브러리 결정 — **수동 검증** 채택 (MVP scope, 의존성 최소화). OQ3 해소.
- [x] 1.3 `src/features/trips/types.ts` 갱신 — `Trip.categoryId?`, `Trip.tags?` 추가, `City.timezone?` 추가, `Category { id, name, color }` 신설
- [x] 1.4 `src/lib/transport.ts` — `TRANSPORT_STYLE`에서 `color` 필드 삭제 (icon, dashArray, weight 유지). `NEUTRAL_COLOR` 상수 추가.
- [x] 1.5 `CLAUDE.md` 색 정책 제약문 갱신 — "색은 Category에서 결정, transport는 아이콘·dash·굵기만" + 시각 저장·표시 정책 추가

## 2. temporal-model 구현

- [x] 2.1 `src/lib/timezone.ts` 신설 — `deriveTimezone(lat, lng)` 헬퍼 (tz-lookup wrapper)
- [x] 2.2 `localToUtc(localISO, ianaTz)` / `formatLocal(utcISO, city, opts)` 헬퍼 작성. `tzAbbreviation` 보너스 헬퍼 추가
- [x] 2.3 `ingestCity(c)` 헬퍼 — City 진입점에서 timezone 보강. `resolveTimezone` 지연 폴백 헬퍼 동반
- [ ] 2.4 `LegForm.tsx` — 도시 선택 후 TZ 라벨(예: "Europe/Paris, CEST") 표시 **[BLOCKED: LegForm 아직 placeholder. §6.4 Trip 편집 화면 작업 시 함께 진행]**
- [ ] 2.5 `LegForm.tsx` 저장 핸들러 — 입력값을 city.timezone 기준으로 UTC 변환 **[BLOCKED: 동일 — §6.4와 함께]**
- [x] 2.6 `LegCard.tsx` 표시 — `formatLocal`로 출발/도착을 각 도시 TZ에 맞춰 렌더. accentColor prop 노출 (값 주입은 §3 trip context 연결 시)
- [ ] 2.7 store 하이드레이션 후처리 — 모든 City를 순회하여 timezone 누락 시 보강 **[BLOCKED: `src/features/trips/store.ts` 미존재. §3.1과 함께 진행]**

## 3. categorization 구현

- [ ] 3.1 `src/features/trips/store.ts` — `categories: Category[]` 배열 추가
- [ ] 3.2 store actions: `createCategory`, `updateCategory`, `deleteCategory` (참조 Trip의 categoryId를 undefined로 정리)
- [ ] 3.3 store actions: `setTripCategory(tripId, categoryId | undefined)`
- [ ] 3.4 Category 관리 UI 위치 결정 — 헤더 진입점 또는 Trip 편집 인라인 (OQ1)
- [ ] 3.5 Category 관리 화면 컴포넌트 — 이름·색상(color picker) 입력, 목록 표시, 삭제
- [ ] 3.6 Trip 편집 화면에 Category 선택 UI 추가 (드롭다운 또는 칩, 비우기 옵션 포함)

## 4. map-visualization 구현

- [ ] 4.1 `TransportPolyline.tsx` — 색 source 변경: `trip.categoryId → categories[id].color ?? '#888888'`
- [ ] 4.2 `TransportPolyline.tsx` — dashArray / weight는 `TRANSPORT_STYLE`에서 그대로
- [ ] 4.3 `MapView.tsx` (또는 별도 hook) — 모든 Leg를 순회하여 (city.name, city.country) 단위로 visit 집계
- [ ] 4.4 `CityMarker.tsx` — 단일 마커 + 팝업에 방문 항목 N개를 시간순 렌더 (transport 아이콘 + 도시 현지시간)
- [ ] 4.5 Trip 카드 좌측 띠 색도 categories에서 조회

## 5. transport-filter 구현

- [ ] 5.1 `TransportFilter.tsx` — 체크된 개수가 1이면 그 체크박스를 disabled
- [ ] 5.2 비활성화된 체크박스에 안내 툴팁 "최소 1개 교통수단을 선택해야 합니다"
- [ ] 5.3 store 또는 컴포넌트 상태 — 초기값 6개 모두 체크
- [ ] 5.4 store persist — 필터 상태가 localStorage에 보존되도록 (또는 매 진입 시 초기화 정책 결정)

## 6. trip-management 구현

- [ ] 6.1 store actions: `updateTripTitle(tripId, title)`, `updateTripTags(tripId, tags)`, `reorderLegs(tripId, newOrder)`
- [ ] 6.2 store action: `deleteTrip(tripId)` — cascade로 legs도 함께 제거. 현재 선택 Trip이면 첫 Trip으로 전환, 0개면 selectedTripId=undefined
- [ ] 6.3 `TripList` 카드 — 우측 ⋮ 메뉴 (편집 / 삭제)
- [ ] 6.4 Trip 편집 화면 — 제목 입력, 태그 입력, Category 선택 (3.6과 합쳐도 됨)
- [ ] 6.5 Leg 드래그 재배치 (`@dnd-kit/sortable` 또는 HTML5 drag&drop) — store.reorderLegs 호출
- [ ] 6.6 Trip 삭제 확인 다이얼로그 — "이 여행의 Leg N개도 함께 삭제됩니다" 메시지

## 7. data-portability 구현

- [ ] 7.1 `src/lib/storage.ts` — Export 함수 (trips + categories 직렬화)
- [ ] 7.2 `src/lib/storage.ts` — Import 핸들러 (3단 검증: parse → 필드 → 값 범위)
- [ ] 7.3 검증 실패 시 원자적 거부 + 사용자에게 보여줄 오류 메시지 포맷 (어느 항목·어느 이유)
- [ ] 7.4 Import 후처리 — 모든 City에 대해 timezone 누락 시 `tz-lookup`으로 보강
- [ ] 7.5 헤더에 Export / Import 버튼 배치 + 파일 입력 다이얼로그

## 8. 문서 동기화

- [ ] 8.1 `REQUIREMENTS.md` — FR-011~FR-023 추가, UC-001/UC-005/FR-009 갱신, AC-008~AC-017 추가, traceability 매트릭스 갱신
- [ ] 8.2 `ARCHITECTURE.md` — Category 엔터티 추가, color 채널 정책 명시
- [ ] 8.3 `TECHDESIGN.md` — tz-lookup 의존성, store 구조 변경 반영
- [ ] 8.4 `UXSPEC.md` — Trip ⋮ 메뉴, Category 관리 UI, LegForm TZ 라벨, 필터 disabled 안내 반영
- [ ] 8.5 `DELIVERYPLAN.md` — 3회차 Must Have / Should Have 항목 갱신 (Category 도입 반영)

## 9. 검증 (수동 QA)

- [ ] 9.1 AC-008~AC-017 시나리오를 수동 QA 체크리스트로 변환
- [ ] 9.2 구버전 JSON Import 시 timezone 자동 채움 동작 확인 (샘플 fixture 작성)
- [ ] 9.3 잘못된 transport 값을 가진 JSON Import → 원자적 거부 확인
- [ ] 9.4 같은 도시 3회 방문 시 마커 1개 + 팝업 3개 항목 확인
- [ ] 9.5 Category 삭제 → 참조 Trip이 회색으로 폴백되는지 확인
- [ ] 9.6 모바일 320px 너비에서 ⋮ 메뉴 / Category 선택 / TZ 라벨 시인성 확인

## 10. 마무리

- [ ] 10.1 `npm run lint` / `npm run build` 무결성 확인
- [ ] 10.2 본 change를 `/opsx:archive`로 `openspec/specs/`로 이관
- [ ] 10.3 3회차 비교 실험 노트 작성 — MD-driven 결과와의 차이점 (별도 문서)
