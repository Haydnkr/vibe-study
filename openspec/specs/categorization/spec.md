# categorization Specification

## Purpose
TBD - created by archiving change clarify-mvp-requirements. Update Purpose after archive.
## Requirements
### Requirement: Category 엔터티 CRUD

The system SHALL allow users to create, edit, and delete Categories (name + color). The system MUST start with zero Categories (no seed) and MUST allow multiple Categories to share the same color without warning. 사용자는 Category를 자유롭게 추가·수정·삭제할 수 있다.

#### Scenario: Category 생성
- **WHEN** 사용자가 Category 관리 화면에서 이름 "휴가"와 색상 #ff0000 을 입력 후 저장한다
- **THEN** 새 Category가 categories 배열에 추가되고 즉시 Trip 선택 UI에서 사용 가능해진다

#### Scenario: Category 이름·색상 수정
- **WHEN** 사용자가 기존 Category의 이름 또는 색을 변경하고 저장한다
- **THEN** 해당 Category를 참조하는 모든 Trip의 폴리라인 색이 즉시 새 색으로 갱신된다

#### Scenario: 같은 색 중복 허용
- **WHEN** 사용자가 이미 #ff0000 을 사용하는 Category가 있는 상태에서 또 다른 Category에 #ff0000 을 지정한다
- **THEN** 시스템은 경고 없이 저장을 허용한다

---

### Requirement: Trip-Category 연결

Each Trip MUST reference zero or one Category via the optional `categoryId` field. The system SHALL allow users to select one existing Category or leave the selection empty during Trip creation and editing. 각 Trip은 0개 또는 1개의 Category를 참조할 수 있다.

#### Scenario: Trip에 Category 지정
- **WHEN** 사용자가 Trip 편집 화면에서 "휴가" Category를 선택하고 저장한다
- **THEN** Trip.categoryId가 해당 Category의 id로 설정되고 지도 폴리라인 색이 "휴가" 색으로 즉시 갱신된다

#### Scenario: Trip의 Category 해제
- **WHEN** 사용자가 Trip 편집 화면에서 Category 선택을 비운다
- **THEN** Trip.categoryId가 undefined가 되고 폴리라인 색이 중립 회색(#888888)으로 폴백된다

---

### Requirement: 폴리라인 색은 Category에서 결정

Polyline color SHALL be derived solely from the owning Trip's Category color. Transport MUST NOT contribute to the color channel and SHALL be visually distinguished only via icon, dash pattern, and weight. 지도 폴리라인 색은 Category 색만 따른다.

#### Scenario: Category가 있는 Trip의 폴리라인
- **GIVEN** Trip이 "휴가" Category(#ff0000)를 참조한다
- **WHEN** 해당 Trip의 Leg가 지도에 렌더된다
- **THEN** 모든 Leg 폴리라인은 #ff0000 색으로 표시되며 transport별로 dash 패턴만 다르게 표현된다

#### Scenario: Category 없는 Trip의 폴리라인 폴백
- **GIVEN** Trip이 Category를 참조하지 않는다 (categoryId === undefined)
- **WHEN** 해당 Trip의 Leg가 지도에 렌더된다
- **THEN** 모든 Leg 폴리라인은 중립 회색(#888888)으로 표시된다

---

### Requirement: Category 삭제 시 Trip은 보존

When a Category is deleted, the system MUST preserve all referencing Trips and MUST set their `categoryId` to undefined. The polyline color for affected Trips SHALL fall back to the neutral gray color (#888888). Category가 삭제되어도 참조 Trip은 보존된다.

#### Scenario: 참조 Trip이 있는 Category 삭제
- **GIVEN** "휴가" Category를 참조하는 Trip 2개가 존재한다
- **WHEN** 사용자가 "휴가" Category를 삭제한다
- **THEN** Category 자체는 categories 배열에서 제거되고, 두 Trip은 보존되며 categoryId가 undefined로 변경된다. 폴리라인 색은 #888888 로 갱신된다

