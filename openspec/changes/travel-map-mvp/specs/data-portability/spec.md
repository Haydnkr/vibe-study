## ADDED Requirements

### Requirement: localStorage 자동 저장
The system SHALL persist `trips`, `selectedTripId`, and `activeTransports` to `localStorage` under key `travel-map-store` on every state change, using Zustand's `persist` middleware.

#### Scenario: 새로고침 후 데이터 유지
- **WHEN** 사용자가 Leg 를 추가·수정·삭제하고 페이지를 새로고침한다
- **THEN** 변경 사항이 그대로 유지된다

#### Scenario: 필터 상태 유지
- **WHEN** 사용자가 교통수단 필터를 토글한 뒤 새로고침한다
- **THEN** 필터 상태(`activeTransports`)가 복원된다

### Requirement: JSON Export
The system SHALL provide an "Export" action in the app header that downloads the current `trips` array as `travel-map-<YYYY-MM-DD>.json` with a versioned envelope `{ version: 1, trips }`.

#### Scenario: Export 다운로드
- **WHEN** 사용자가 헤더의 Export 버튼을 누른다
- **THEN** 브라우저가 `travel-map-<오늘>.json` 파일을 다운로드한다

### Requirement: JSON Import (완전 교체)
The system SHALL provide an "Import" action that, after the user picks a JSON file, shows a confirmation dialog ("기존 데이터를 덮어쓸까요?"). Upon confirmation, the existing `trips` array MUST be entirely replaced (no merging).

#### Scenario: 확인 후 덮어쓰기
- **WHEN** 사용자가 유효한 JSON 파일을 Import 로 선택하고 덮어쓰기 확인을 누른다
- **THEN** 기존 `trips` 가 파일의 `trips` 로 완전히 교체되고 `selectedTripId` 는 `null` 로 초기화된다

#### Scenario: 취소 시 데이터 유지
- **WHEN** 사용자가 확인 다이얼로그에서 취소를 누른다
- **THEN** 기존 데이터는 그대로 유지된다

#### Scenario: 유효하지 않은 JSON
- **WHEN** 사용자가 형식이 잘못된 JSON 파일(파싱 실패 또는 `trips` 배열 없음)을 선택한다
- **THEN** 오류 메시지("유효하지 않은 JSON 형식입니다.") 가 표시되고 기존 데이터는 유지된다
