## ADDED Requirements

### Requirement: 6개 교통수단 체크박스 필터

The system SHALL provide a sidebar filter UI with six checkboxes (plane, train, car, bus, ship, walk). The map MUST render polylines only for Legs whose transport is included in the currently checked set. 6개 transport 체크박스 필터를 제공한다.

#### Scenario: 체크된 transport만 지도에 표시
- **GIVEN** plane과 train이 체크되어 있고 다른 4개는 해제되어 있다
- **WHEN** 지도가 렌더된다
- **THEN** plane 또는 train transport인 Leg의 폴리라인만 표시되고, car/bus/ship/walk는 숨겨진다

---

### Requirement: 최소 1개 체크 유지 강제

The system MUST keep at least one of the six checkboxes checked at all times. When exactly one checkbox is checked, that last remaining checkbox MUST be disabled so it cannot be unchecked. A tooltip SHALL explain the constraint. 최소 1개 체크 유지를 강제한다.

#### Scenario: 마지막 1개 체크박스 비활성화
- **GIVEN** plane만 체크된 상태이다 (체크된 transport 1개)
- **WHEN** 사용자가 plane 체크박스에 마우스를 올린다
- **THEN** plane 체크박스는 비활성화 상태로 표시되며 해제할 수 없다. 안내 툴팁 "최소 1개 교통수단을 선택해야 합니다"가 표시된다

#### Scenario: 2개 이상 체크된 상태에서는 해제 가능
- **GIVEN** plane과 train이 체크된 상태이다 (체크된 transport 2개)
- **WHEN** 사용자가 plane을 해제한다
- **THEN** plane이 해제되고 train만 체크된 상태가 된다. train 체크박스는 이제 비활성화된다

#### Scenario: 전체 표시 의도는 모든 체크박스 체크로 표현
- **WHEN** 사용자가 모든 6개 체크박스를 체크한다
- **THEN** 모든 transport의 Leg가 지도에 렌더된다

---

### Requirement: 초기 상태는 전체 체크

On first app entry or after a filter state reset, the system MUST initialize all six transport checkboxes as checked. 초기 상태에서는 6개 모두 체크되어 있다.

#### Scenario: 첫 진입 시 모든 transport 표시
- **GIVEN** 사용자가 앱에 처음 진입한다 (localStorage에 필터 상태 없음)
- **WHEN** /app 페이지가 로드된다
- **THEN** 6개 체크박스가 모두 체크된 상태이고, 모든 transport의 Leg가 지도에 렌더된다
