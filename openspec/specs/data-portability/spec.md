# data-portability Specification

## Purpose
TBD - created by archiving change clarify-mvp-requirements. Update Purpose after archive.
## Requirements
### Requirement: JSON Export

The system SHALL allow users to download the entire store state (trips, categories) as a single JSON file via the header Export button. Round-tripping the exported file through Import MUST reproduce the identical store state (lossless). JSON Export는 store 전체를 무손실로 보존한다.

#### Scenario: Export 후 Import 라운드트립
- **GIVEN** store에 trips 2개와 categories 3개가 있다
- **WHEN** 사용자가 Export로 받은 파일을 즉시 Import한다
- **THEN** Import 후 store의 trips와 categories는 Export 시점과 동일하다 (id, 순서, 필드 값 일치)

---

### Requirement: Import 스키마 검증 (형식 + 필드 + 값 범위)

The import handler MUST validate incoming JSON in three stages: (1) JSON syntax parsing, (2) required-field presence check, (3) value-range and enum check. The validation SHALL include the following:

- `transport`는 `plane | train | car | bus | ship | walk` 중 하나
- `lat`은 -90 이상 90 이하, `lng`는 -180 이상 180 이하
- `departedAt`, `arrivedAt`은 ISO 8601 형식 문자열
- 필수 필드: Trip의 id/title/legs, Leg의 id/from/to/transport/departedAt/arrivedAt, City의 name/country/lat/lng

#### Scenario: 잘못된 transport 값은 거부
- **GIVEN** JSON에 transport: "비행기" 인 Leg가 포함된다
- **WHEN** 사용자가 해당 파일을 Import한다
- **THEN** 시스템은 검증 단계에서 invalid로 판정하여 Import를 거부하고 오류 메시지를 표시한다

#### Scenario: 좌표 범위 초과는 거부
- **GIVEN** JSON의 City에 lat: 91.0 (범위 초과)이 있다
- **WHEN** Import가 시도된다
- **THEN** 검증이 실패하고 Import가 거부된다

#### Scenario: 모든 필드가 valid한 JSON은 통과
- **GIVEN** 모든 필드가 스키마를 만족하는 JSON 파일이다
- **WHEN** Import가 실행된다
- **THEN** 검증을 통과하고 후처리 단계(timezone 보강)로 진입한다

---

### Requirement: Import 실패는 원자적 거부

If any item fails validation, the system MUST abort the entire import and SHALL keep the existing store state unchanged. The system MUST NOT import a partial subset and MUST NOT attempt silent auto-fixes. Import 실패 시 원자적 거부 — 기존 데이터는 그대로 유지된다.

#### Scenario: 100개 중 1개 invalid → 전체 거부
- **GIVEN** Trip 100개 중 99개는 valid, 1개의 transport 필드가 invalid이다
- **WHEN** 사용자가 Import한다
- **THEN** 시스템은 99개를 import하지 않고 기존 store 상태를 그대로 유지한다. 사용자에게는 어느 항목이 어느 이유로 실패했는지 명시한 오류 메시지가 표시된다

#### Scenario: 기존 데이터 무결성 보장
- **GIVEN** Import 실패가 발생했다
- **WHEN** Import 결과를 확인한다
- **THEN** store는 Import 시도 이전과 비트 단위로 동일하다

---

### Requirement: 구버전 마이그레이션 — timezone 보강

For legacy JSON files lacking `City.timezone`, the validator MUST treat `timezone` as optional and SHALL not fail on its absence. After validation passes, a post-process step MUST populate any missing `City.timezone` by calling `tz-lookup` with the City's `lat`/`lng`. 구버전 JSON은 timezone 누락이 허용되며 import 후처리에서 자동 채워진다.

#### Scenario: timezone 누락 구버전 import
- **GIVEN** 가져온 JSON의 모든 City에 timezone 필드가 없다 (다른 필드는 모두 valid)
- **WHEN** 사용자가 Import한다
- **THEN** 검증을 통과하고, 후처리 단계에서 각 City의 timezone이 lat/lng로부터 채워진 후 store에 반영된다

#### Scenario: 일부 City만 timezone 누락
- **GIVEN** 일부 City는 timezone이 있고, 일부는 없다
- **WHEN** Import 후처리가 실행된다
- **THEN** timezone이 없는 City만 보강되고, 기존 timezone 값은 변경되지 않는다

