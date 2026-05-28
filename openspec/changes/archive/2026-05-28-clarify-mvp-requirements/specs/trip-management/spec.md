## ADDED Requirements

### Requirement: Trip 생성

The system SHALL allow users to create a new Trip by entering a non-empty title, and MUST reject empty titles. 사용자는 제목을 입력하여 새 Trip을 생성할 수 있다.

#### Scenario: 제목을 입력하여 Trip 생성
- **WHEN** 사용자가 헤더의 `+ 여행` 버튼을 누르고 비어있지 않은 제목을 입력 후 저장한다
- **THEN** 시스템은 새 Trip을 사이드바 TripList 에 추가하고 자동으로 선택 상태로 만든다

#### Scenario: 빈 제목 입력 차단
- **WHEN** 사용자가 제목을 비운 채로 저장 버튼을 누르려 한다
- **THEN** 저장 버튼은 비활성화 상태이며 Trip이 생성되지 않는다

---

### Requirement: Trip 제목 수정

The system SHALL allow users to edit an existing Trip's title and MUST reflect the change immediately in the sidebar and header. 사용자는 기존 Trip의 제목을 수정할 수 있다.

#### Scenario: 제목 변경 즉시 반영
- **WHEN** 사용자가 TripList 카드의 ⋮ 메뉴에서 [편집]을 선택하고 새 제목을 입력 후 저장한다
- **THEN** 사이드바 카드와 앱 헤더의 Trip 제목이 즉시 새 값으로 갱신된다

---

### Requirement: Trip 태그 관리

The system SHALL allow users to add or remove zero or more text tags on a Trip. Tags MUST NOT be used as a source for visual color rendering. 사용자는 Trip에 텍스트 태그를 0개 이상 추가하거나 제거할 수 있다.

#### Scenario: 태그 추가
- **WHEN** 사용자가 Trip 편집 화면에서 태그 입력 필드에 "유럽"을 추가하고 저장한다
- **THEN** 해당 Trip의 tags 배열에 "유럽"이 포함되고 사이드바 카드에 칩으로 표시된다

#### Scenario: 태그 제거
- **WHEN** 사용자가 기존 태그 칩의 ✕ 아이콘을 누른다
- **THEN** 해당 태그가 즉시 tags 배열에서 제거된다

---

### Requirement: Trip 안의 Leg 순서 변경

The system SHALL allow users to reorder Legs within a Trip via drag or explicit move action. The reordered sequence MUST be persisted as the Trip.legs array index order. 사용자는 Trip 안 Leg의 순서를 재배치할 수 있다.

#### Scenario: 드래그로 Leg 순서 재배치
- **WHEN** 사용자가 사이드바 LegCard를 드래그하여 다른 위치에 놓는다
- **THEN** Trip.legs 배열 순서가 새 순서로 갱신되고 지도 폴리라인 연결 순서도 동일하게 반영된다

---

### Requirement: Trip 삭제 (cascade)

The system SHALL allow users to delete a Trip and MUST cascade-delete all its Legs. The system MUST display a confirmation dialog stating the number of affected Legs before deletion proceeds. 사용자는 Trip을 삭제할 수 있으며, 삭제 시 해당 Trip의 모든 Leg가 함께 제거된다.

#### Scenario: 확인 다이얼로그를 통한 삭제
- **WHEN** 사용자가 TripList 카드의 ⋮ 메뉴에서 [삭제]를 선택하고 확인 다이얼로그에서 [삭제]를 누른다
- **THEN** 해당 Trip과 그 안의 모든 Leg가 store와 지도에서 제거된다

#### Scenario: 삭제 다이얼로그 취소
- **WHEN** 사용자가 삭제 확인 다이얼로그에서 [취소]를 누른다
- **THEN** 데이터는 변경되지 않고 다이얼로그가 닫힌다

#### Scenario: 선택된 Trip 삭제 후 자동 선택 전환
- **WHEN** 현재 선택된 Trip이 삭제된다
- **THEN** 시스템은 TripList의 첫 번째 Trip을 자동 선택한다. Trip이 0개라면 EmptyState 화면을 표시한다
