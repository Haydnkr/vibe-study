## ADDED Requirements

### Requirement: Trip 생성
The system SHALL allow the user to create a Trip with a non-empty title via a dialog opened from the app header or empty state.

#### Scenario: 제목 입력 후 저장
- **WHEN** 사용자가 `+ 여행` 버튼을 눌러 다이얼로그를 열고, 제목을 입력한 뒤 저장한다
- **THEN** 새 Trip 이 사이드바 TripList 에 추가되고 `selectedTripId` 가 그 Trip 으로 설정된다

#### Scenario: 빈 제목 저장 차단
- **WHEN** 사용자가 제목을 비운 상태로 두면
- **THEN** 저장 버튼은 `disabled` 상태이며 폼 제출이 무시된다

### Requirement: Leg 생성
The system SHALL allow the user to add a Leg to a selected Trip with from-City, to-City, transport mode, departed-at timestamp, optional arrived-at timestamp, and optional note.

#### Scenario: 모든 필수 필드 입력 후 저장
- **WHEN** 사용자가 출발 도시, 도착 도시, 교통수단, 출발 일시를 채우고 저장한다
- **THEN** 새 Leg 가 해당 Trip 의 `legs` 배열에 추가되고, 같은 Trip 의 모든 Leg 가 `departedAt` 오름차순으로 정렬된다

#### Scenario: 필수 필드 누락 시 저장 차단
- **WHEN** 출발 도시·도착 도시·교통수단·출발 일시 중 하나라도 누락된 상태로 사용자가 저장을 시도한다
- **THEN** 저장 버튼은 `disabled` 상태이며 폼 제출이 무시된다 (메모는 선택)

#### Scenario: 도착 일시 생략
- **WHEN** 사용자가 도착 일시를 비운 채 저장한다
- **THEN** Leg 의 `arrivedAt` 은 출발 일시와 동일하게 저장된다

### Requirement: Leg 수정
The system SHALL allow the user to edit an existing Leg through a form pre-filled with current values; changes MUST be reflected on the map immediately after save.

#### Scenario: Leg 편집 후 저장
- **WHEN** 사용자가 LegCard 의 편집 아이콘을 눌러 폼을 열고, 값을 수정한 뒤 저장한다
- **THEN** 해당 Leg 가 새 값으로 갱신되고, 사이드바 목록과 지도가 즉시 반영되며, Trip 의 Leg 순서가 `departedAt` 기준으로 재정렬된다

### Requirement: Leg 삭제
The system SHALL require an explicit confirmation dialog before deleting a Leg.

#### Scenario: 삭제 확인
- **WHEN** 사용자가 LegCard 의 삭제 아이콘을 눌러 확인 다이얼로그가 표시되고, 확인을 누른다
- **THEN** 해당 Leg 가 Trip 에서 제거되고 사이드바·지도에 즉시 반영된다

#### Scenario: 삭제 취소
- **WHEN** 사용자가 삭제 확인 다이얼로그에서 취소를 누른다
- **THEN** Leg 는 그대로 유지되고 다이얼로그가 닫힌다

### Requirement: Trip 선택 (사이드바)
The system SHALL maintain a `selectedTripId`; when set, only the selected Trip's Legs are rendered on the map. Selecting the same Trip again clears the selection.

#### Scenario: Trip 토글
- **WHEN** 사용자가 TripList 에서 Trip 제목을 클릭한다 (선택 상태가 아닐 때)
- **THEN** 해당 Trip 만 지도에 표시되고 사이드바에서 활성 상태로 강조된다

#### Scenario: 선택 해제
- **WHEN** 이미 선택된 Trip 제목을 다시 클릭한다
- **THEN** `selectedTripId` 가 `null` 이 되고 모든 Trip 의 Leg 가 지도에 표시된다

### Requirement: Leg 메모 (선택 필드)
The system SHALL allow each Leg to carry an optional single-line note; LegCard SHALL display the note as a single muted line truncated when too long.

#### Scenario: 메모와 함께 저장
- **WHEN** 사용자가 LegForm 의 메모 필드에 텍스트를 입력하고 저장한다
- **THEN** 그 텍스트가 Leg.note 로 저장되고 LegCard 에 한 줄로 표시된다

#### Scenario: 메모 없이 저장
- **WHEN** 사용자가 메모 필드를 비운 채 저장한다
- **THEN** Leg.note 는 `undefined` 로 저장되고 LegCard 에 메모 영역이 표시되지 않는다
