# temporal-model Specification

## Purpose
TBD - created by archiving change clarify-mvp-requirements. Update Purpose after archive.
## Requirements
### Requirement: Leg 시각은 UTC 고정으로 저장

`Leg.departedAt` and `Leg.arrivedAt` MUST be stored exclusively as UTC ISO 8601 strings. On user input, the system SHALL interpret the entered time using the corresponding city's IANA timezone and convert it to UTC before persisting. Leg 시각은 UTC ISO 8601로만 저장된다.

#### Scenario: 현지시간 입력을 UTC로 변환 저장
- **GIVEN** from 도시가 Asia/Seoul TZ이고 사용자가 출발 일시를 "2026-05-27 10:00"으로 입력한다
- **WHEN** 사용자가 Leg 저장 버튼을 누른다
- **THEN** `Leg.departedAt`은 "2026-05-27T01:00:00Z" (UTC)로 저장된다

---

### Requirement: 표시 시 도시 TZ로 변환

At every rendering site (LegCard, marker popup, sorted lists), departure time SHALL be displayed in the departure city's timezone and arrival time SHALL be displayed in the arrival city's timezone. The system MUST use `Intl.DateTimeFormat` so that DST transitions are reflected automatically. 시각 표시는 도시별 TZ로 변환되어 이루어진다.

#### Scenario: 한 Leg의 시각이 도시별로 분리 표시
- **GIVEN** Leg가 ICN(Asia/Seoul)에서 CDG(Europe/Paris)로 가며 `departedAt="2026-05-27T01:00:00Z"`, `arrivedAt="2026-05-27T11:30:00Z"`이다
- **WHEN** LegCard가 렌더된다
- **THEN** "ICN 10:00 (KST) → CDG 13:30 (CEST)" 형태로 출발/도착 시각이 각 도시 현지시간으로 표시된다

---

### Requirement: City.timezone은 옵셔널이며 자동 결정

`City.timezone` SHALL be an optional field. When a City enters the system (creation, search selection, or import) without a `timezone` value, the system MUST automatically populate it by invoking `tz-lookup` with the City's `lat`/`lng`. City.timezone은 누락 시 lat/lng로 자동 채워진다.

#### Scenario: 검색으로 추가된 City의 timezone 자동 결정
- **WHEN** 사용자가 도시 검색 결과에서 파리를 선택하여 from 도시로 채택한다 (Nominatim은 lat/lng만 반환)
- **THEN** 시스템은 lat/lng 으로 tz-lookup을 호출하여 "Europe/Paris"를 도출하고 City.timezone에 저장한다

#### Scenario: 구버전 JSON Import 시 timezone 보강
- **GIVEN** 가져온 JSON의 City에 timezone 필드가 없다
- **WHEN** Import 후처리 단계가 실행된다
- **THEN** 각 City의 lat/lng 으로 tz-lookup이 호출되어 timezone이 채워진다

---

### Requirement: LegForm 입력 UX

LegForm date/time fields MUST guide the user to enter values in the corresponding city's local time. When a city is selected, the system SHALL display the city's IANA timezone label (e.g., "Europe/Paris, CEST") next to the corresponding date/time field. LegForm 시각 입력은 각 도시 현지시간 기준이며 TZ 라벨이 표시된다.

#### Scenario: 도시 선택 후 TZ 라벨 표시
- **WHEN** 사용자가 from 도시 자동완성에서 파리를 선택한다
- **THEN** 출발 일시 입력 필드 옆에 "(Europe/Paris)" 라벨이 표시되어 입력 기준 TZ를 사용자가 인지할 수 있다

