## Why

여행 기록은 텍스트 목록만으로는 한눈에 들어오지 않는다. 사용자는 방문한 도시와 교통수단을 시간순으로 지도 위에 시각화해 자신의 여정을 한 장면처럼 보고 싶어 한다. 서버나 로그인 없이도, 단일 사용자가 브라우저만으로 끝낼 수 있는 가벼운 도구가 필요하다.

## What Changes

- 사용자가 **여행(Trip)** 을 생성하고 그 안에 **구간(Leg)** 을 누적할 수 있다 — 출발 도시, 도착 도시, 교통수단, 출발/도착 일시, 메모.
- 도시 이름을 입력하면 **Nominatim** 자동완성으로 좌표를 채운다 (300ms 디바운스, 1 req/sec 제한 준수).
- 저장된 Leg는 **Leaflet 지도** 위에서 도시 마커 + 교통수단별 색상 경로선으로 즉시 렌더된다. 마커 클릭 시 도시명·국가·일시 팝업이 뜬다.
- **교통수단 필터** (plane / train / car / bus / ship / walk) 토글로 지도 경로를 즉시 줄이고 늘릴 수 있다.
- 모든 변경은 **localStorage** 에 자동 저장된다 (브라우저 새로고침에도 유지).
- **JSON Export / Import** 로 데이터를 백업·복원한다. Import 는 기존 trips 를 **완전히 교체**한다 (병합 X) — 사용자 확인 다이얼로그 필수.
- 단일 사용자 · 로그인 없음 · 서버 DB 없음. Next.js 14 정적 빌드(`output: 'export'`) 로 Vercel 또는 GitHub Pages 배포 가능.

## Capabilities

### New Capabilities

- `trip-management`: 여행(Trip)과 구간(Leg)의 생성·수정·삭제. Leg 는 출발/도착 도시, 교통수단, 일시, 선택 메모를 가진다. 같은 Trip 의 Leg 들은 `departedAt` 시간순으로 자동 정렬된다.
- `city-geocoding`: 외부 Nominatim API 를 통한 도시 이름 → 좌표 자동완성. 300ms 디바운스로 rate limit 보호.
- `route-map`: Leaflet + OpenStreetMap 타일 기반 지도. 도시 마커, 교통수단별 색상 폴리라인, 마커 팝업, 교통수단 필터, 선택된 Trip 자동 포커스를 포함한다.
- `data-portability`: 모든 상태의 localStorage 자동 저장(persist), JSON 파일 Export, JSON 파일 Import(덮어쓰기 확인 다이얼로그).

### Modified Capabilities

(없음 — 신규 프로젝트)

## Impact

- **New runtime deps**: `zustand` (state + persist), `leaflet`, `react-leaflet` (지도), `next` · `react` · `tailwindcss` (베이스).
- **New code**: `src/features/trips/`, `src/features/search/`, `src/features/map/`, `src/features/filter/`, `src/lib/storage.ts`, `src/lib/transport.ts`, 두 라우트 (`/`, `/app`).
- **External services**: Nominatim (도시 검색, 키 불필요, rate limit 1 req/sec), OpenStreetMap 타일.
- **Storage**: 브라우저 localStorage 키 `travel-map-store`. 서버 DB 없음.
- **Out of scope**: 로그인, 사진 업로드, 실시간 협업, 모바일 네이티브 앱, 다중 외부 API. 이는 후속 change 에서 다룬다.
