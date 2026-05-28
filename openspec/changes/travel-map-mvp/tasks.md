## 1. Setup

- [ ] 1.1 `package.json` 작성 (Next.js 14, React 18, TypeScript, Tailwind, ESLint)
- [ ] 1.2 `next.config.mjs` 에 `output: 'export'`, `images: { unoptimized: true }` 설정
- [ ] 1.3 `tailwind.config.ts` 에 DESIGN.md 토큰 (colors, transport-*, rounded, spacing) 매핑
- [ ] 1.4 `tsconfig.json` (strict, paths `@/*` → `./src/*`)
- [ ] 1.5 `.gitignore` (node_modules, .next, out, .env*, .claude/settings.local.json)
- [ ] 1.6 `src/app/globals.css` (Tailwind base + Inter 폰트 변수)
- [ ] 1.7 `src/app/layout.tsx` (next/font/google 로 Inter 로드, metadata)
- [ ] 1.8 의존성 설치: `zustand@^4`, `leaflet@^1.9`, `react-leaflet@^4.2` (React 18 peer 호환)

## 2. Types & Constants

- [ ] 2.1 `src/features/trips/types.ts` — `Transport`, `City`, `Leg`, `Trip` 타입
- [ ] 2.2 `src/lib/transport.ts` — `TRANSPORT_STYLE` (DESIGN.md 색상과 동일), `TRANSPORTS` 배열

## 3. State (trip-management · data-portability)

- [ ] 3.1 `src/features/trips/store.ts` — Zustand store 인터페이스 (Spec: trip-management.Requirement.Trip 생성 외)
- [ ] 3.2 `persist` 미들웨어로 `travel-map-store` 키에 `trips` · `selectedTripId` · `activeTransports` 저장 (Spec: data-portability.Requirement.localStorage 자동 저장)
- [ ] 3.3 `addTrip` / `updateTripTitle` / `removeTrip` / `selectTrip` 액션
- [ ] 3.4 `addLeg` / `updateLeg` / `removeLeg` — Leg 추가·갱신 시 `departedAt` 오름차순 자동 정렬
- [ ] 3.5 `setActiveTransports` / `replaceTrips` (Import 용)

## 4. City Geocoding

- [ ] 4.1 `src/features/search/geocode.ts` — Nominatim `fetch` wrapper (`q`, `format=json`, `limit=5`, `addressdetails=1`)
- [ ] 4.2 응답을 `City[]` 로 매핑 (`display_name.split(',')[0]`, `address.country`, lat, lng)
- [ ] 4.3 비정상 응답·네트워크 오류 시 빈 배열 반환 (Spec: city-geocoding.Requirement.외부 API 실패 안전 처리)
- [ ] 4.4 `src/features/search/components/CitySearch.tsx` — input + 자동완성 드롭다운
- [ ] 4.5 입력 디바운스 300ms; 컴포넌트 unmount 시 cleanup (Spec: city-geocoding.Requirement.디바운스)
- [ ] 4.6 외부 클릭 시 드롭다운 닫기, "검색 결과 없음" 안내

## 5. Trip & Leg UI (trip-management)

- [ ] 5.1 `src/components/ui/Dialog.tsx` — 공통 모달 (Escape 키 close, backdrop click close, role=dialog)
- [ ] 5.2 `src/features/trips/components/TripCreateDialog.tsx` — 제목 인풋 + Save (빈 제목이면 disabled)
- [ ] 5.3 `src/features/trips/components/LegForm.tsx` — CitySearch x2 + 교통수단 칩 6개 + datetime-local 2개 + 메모
- [ ] 5.4 LegForm 저장 버튼 disabled 룰: 출발·도착·교통수단·출발일시 중 하나라도 누락이면 disabled (Spec: trip-management.Requirement.Leg 생성)
- [ ] 5.5 LegForm initialLeg prop 으로 편집 모드 지원 (Spec: trip-management.Requirement.Leg 수정)
- [ ] 5.6 `src/features/trips/components/LegCard.tsx` — 좌측 3px 교통수단 색상 보더, 편집/삭제 ghost 버튼
- [ ] 5.7 `src/features/trips/components/TripList.tsx` — Trip 아코디언; 제목 클릭 → selectTrip 토글
- [ ] 5.8 `src/features/trips/components/EmptyState.tsx` — Trip 0 일 때 MapView 위 오버레이

## 6. Route Map (route-map)

- [ ] 6.1 `src/features/map/components/MapView.tsx` — `MapContainer` + OpenStreetMap `TileLayer` (Spec: route-map.Requirement.지도 컨테이너 SSR 안전)
- [ ] 6.2 `src/features/map/components/CityMarker.tsx` — `L.divIcon` 으로 12px 원형 마커, 교통수단 색상 채움
- [ ] 6.3 마커 클릭 시 도시명·국가·날짜 팝업 (Spec: route-map.Requirement.도시 마커 렌더)
- [ ] 6.4 `src/features/map/components/TransportPolyline.tsx` — `Polyline` 에 `TRANSPORT_STYLE` 색상·dash 적용
- [ ] 6.5 필터 비활성 Leg 는 `opacity: 0.15` 로 흐리게 (Spec: route-map.Requirement.교통수단 필터)
- [ ] 6.6 `FitBounds` 자식 컴포넌트 — 가시 Leg 좌표 집합을 `map.fitBounds` 로 자동 줌 (Spec: route-map.Requirement.지도 자동 포커스)
- [ ] 6.7 `src/features/filter/components/TransportFilter.tsx` — 6개 토글 칩 (활성 시 교통수단 색상 배경) + "전체 표시로 초기화"

## 7. Data Portability (data-portability)

- [ ] 7.1 `src/lib/storage.ts` — `exportTrips(trips)` (Blob 다운로드, `travel-map-<date>.json`)
- [ ] 7.2 `importTrips(file)` — FileReader 로 텍스트 읽고 JSON.parse; `trips` 배열 누락 시 reject
- [ ] 7.3 AppHeader Import 버튼 → 파일 선택 → 확인 다이얼로그 → `replaceTrips` (Spec: data-portability.Requirement.JSON Import)
- [ ] 7.4 AppHeader Export 버튼 → `exportTrips(trips)`
- [ ] 7.5 Import 실패 시 오류 다이얼로그

## 8. Layout & Routes

- [ ] 8.1 `src/components/layout/AppHeader.tsx` — 56px 고정, Import/Export/+ 여행 버튼 + 숨김 file input
- [ ] 8.2 `src/app/page.tsx` — Landing (Hero · Problem · Features · 시그니처 카드 · CTA · Footer)
- [ ] 8.3 `src/app/app/page.tsx` ('use client') — 사이드바(TripList + TransportFilter + + 여행) + MapView (`next/dynamic` ssr:false) + 모든 다이얼로그 오케스트레이션
- [ ] 8.4 Leg 삭제 확인 다이얼로그 (Spec: trip-management.Requirement.Leg 삭제)

## 9. Verification

- [ ] 9.1 `npm run build` 오류 없이 통과 (5 페이지 정적 prerender)
- [ ] 9.2 `npm run dev` `/`, `/app` 둘 다 200
- [ ] 9.3 수동 QA — Trip 생성 → Leg 추가(도시 검색 자동완성 동작) → 지도에 마커 2개 + 폴리라인 → 필터 토글 → 편집/삭제 확인 다이얼로그 → Export → Import 덮어쓰기 → 새로고침 후 데이터 유지
