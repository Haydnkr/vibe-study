## ADDED Requirements

### Requirement: 지도 컨테이너 (SSR 안전)
The system SHALL render a Leaflet map on the `/app` route using OpenStreetMap tiles, loaded with `next/dynamic({ ssr: false })` to avoid SSR crashes from `window` references.

#### Scenario: 정적 빌드 후 첫 진입
- **WHEN** 사용자가 정적 빌드된 `/app` 페이지를 처음 로드한다
- **THEN** SSR 단계에서 지도 컴포넌트는 placeholder(스켈레톤) 로 표시되고, 클라이언트 hydrate 후 Leaflet 지도가 마운트된다

### Requirement: 도시 마커 렌더
The system SHALL render a circular City Marker (`L.divIcon`, 12px) at each Leg's `from` and `to` coordinates; the marker's fill MUST be the transport color of that Leg.

#### Scenario: Leg 저장 후 마커 표시
- **WHEN** Leg 가 새로 저장된다
- **THEN** 그 Leg 의 출발·도착 도시 좌표에 교통수단 색상 채움의 원형 마커 두 개가 즉시 표시된다

#### Scenario: 마커 클릭 팝업
- **WHEN** 사용자가 도시 마커를 클릭한다
- **THEN** 도시명, 국가, `departedAt` 날짜(YYYY-MM-DD)를 표시하는 팝업이 열린다

### Requirement: 교통수단별 색상 경로선
The system SHALL connect each Leg's from/to coordinates with a polyline whose color, dash pattern, and stroke style come from `TRANSPORT_STYLE` (`src/lib/transport.ts`). Inline hex SHALL NOT be used.

#### Scenario: 교통수단별 시각화
- **WHEN** plane Leg 가 지도에 그려진다
- **THEN** 폴리라인은 `#2563eb` 색상과 `8 4` dash 로 표시된다

#### Scenario: 토큰 단일 출처
- **WHEN** `TRANSPORT_STYLE.plane.color` 가 변경된다
- **THEN** 지도 폴리라인, LegCard 좌측 보더, TransportFilter 활성 칩 세 위치 모두 동일하게 갱신된다

### Requirement: 교통수단 필터
The system SHALL provide six transport toggles (`plane`, `train`, `car`, `bus`, `ship`, `walk`). When all toggles are inactive the system treats it as "show all". When any toggle is active, only matching Legs are visible.

#### Scenario: 일부 교통수단 활성
- **WHEN** 사용자가 plane 과 train 토글만 활성으로 둔다
- **THEN** plane 또는 train Leg 의 마커와 폴리라인만 표시되고, 나머지는 숨겨지거나 흐리게(`opacity: 0.15`) 처리된다

#### Scenario: 모든 토글 비활성 = 전체 표시
- **WHEN** 모든 토글이 비활성 상태이다
- **THEN** 모든 Leg 가 지도에 표시된다

### Requirement: 지도 자동 포커스
The system SHALL fit the map viewport to the bounds of currently visible Legs whenever the set of visible Legs changes (Leg add/update/delete, Trip selection change, filter change).

#### Scenario: Leg 저장 후 자동 줌
- **WHEN** 첫 Leg 를 추가한다
- **THEN** 지도가 그 Leg 의 두 좌표를 포함하는 범위로 자동 줌·이동한다

#### Scenario: Trip 선택 후 자동 줌
- **WHEN** 사용자가 사이드바에서 Trip 을 선택한다
- **THEN** 지도가 해당 Trip 의 모든 Leg 좌표를 포함하는 범위로 자동 줌·이동한다
