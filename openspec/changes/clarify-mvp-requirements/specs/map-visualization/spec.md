## ADDED Requirements

### Requirement: 도시 마커는 (name + country) 단위로 unique

City markers MUST be unique per (`name`, `country`) pair. Even when a City referenced by the same pair appears across multiple Legs' from/to fields, the system SHALL render exactly one marker for it. 도시 마커는 (name, country) 단위로 1개만 그려진다.

#### Scenario: 같은 도시를 여러 Leg가 참조해도 마커 1개
- **GIVEN** Leg A의 to가 (Paris, FR), Leg B의 from이 (Paris, FR)이다
- **WHEN** 지도가 렌더된다
- **THEN** Paris 위치에는 마커가 정확히 1개만 그려진다

---

### Requirement: 동일 도시 다중 방문은 팝업에 시간 순으로 나열

When a city has been visited N times, clicking the single marker MUST open a popup that lists all visit times in chronological order. Each visit entry SHALL include the transport icon of the Leg that entered or exited the city at that time and the visit time rendered in the city's local timezone. 다중 방문은 팝업 내에 시간 순 N개로 표시된다.

#### Scenario: 파리 3회 방문 팝업
- **GIVEN** Paris를 3개의 서로 다른 Leg에서 도착지로 사용했다 (2024-08-12, 2025-03-04, 2026-05-27)
- **WHEN** 사용자가 Paris 마커를 클릭한다
- **THEN** 팝업에 "Paris, France" 헤더와 3개의 방문 항목이 시간 순으로 표시된다

#### Scenario: 0회 방문 케이스 (해당 없음)
- **WHEN** 어떤 도시도 Leg에서 사용되지 않는다
- **THEN** 그 도시 마커는 지도에 그려지지 않는다

---

### Requirement: 폴리라인 색은 Category, 패턴은 Transport

The polyline visual channels MUST be cleanly separated: color SHALL be derived from the owning Trip's Category, and dash pattern, weight, and transport icon SHALL be derived from the Transport definition only. The system MUST NOT mix these channels. 색은 Category, 패턴은 Transport — 채널 분리.

#### Scenario: 같은 Trip 안 다른 transport
- **GIVEN** Trip이 "휴가" Category(#ff0000)를 가지며 plane Leg와 train Leg를 각 1개씩 포함한다
- **WHEN** 지도가 렌더된다
- **THEN** 두 폴리라인 모두 #ff0000 색이며 plane은 plane용 dash, train은 train용 dash 패턴으로 그려진다

#### Scenario: TRANSPORT_STYLE에 색상 필드 없음 (구조 제약)
- **GIVEN** `src/lib/transport.ts`의 `TRANSPORT_STYLE` 상수
- **WHEN** 코드를 검토한다
- **THEN** 각 transport 정의에 color 키가 존재하지 않는다 (icon, dashArray, weight 만 존재)

---

### Requirement: 마커 팝업 정보 범위

A marker popup MUST contain: (1) a header with city name and country, and (2) all visit entries in chronological order. Each visit entry SHALL display the transport icon of the Leg that passed through the city at that time alongside the visit time. 팝업은 도시명·국가 + 방문 항목들로 구성된다.

#### Scenario: 팝업 콘텐츠 구성
- **WHEN** 사용자가 마커 팝업을 연다
- **THEN** 팝업은 다음 순서로 표시된다: 1) "도시명, 국가" 헤더, 2) 각 방문 항목 (시간 순, 각 항목은 [transport 아이콘 + 방문 일시] 형태)
