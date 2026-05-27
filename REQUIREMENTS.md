# Travel Map MVP — 요구사항 명세

> ARCHITECTURE.md 의 스택·데이터 모델을 기반으로 작성된 요구사항 문서입니다.

---

## 1. Actors

| Actor | Description |
|---|---|
| Primary User | 여행 기록을 남기고 지도로 시각화하려는 여행가 |
| Optional Admin | 이번 MVP에서는 제외 — 단일 사용자 기준으로 처리 |

---

## 2. Main Use Cases

### UC-001. Trip(여행) 생성

- **Actor**: Primary User
- **Goal**: 여행을 하나의 단위로 만들어 그 안에 Leg(구간)을 누적할 수 있게 한다
- **Precondition**: 없음 (앱 초기 진입 직후 가능)
- **Main Flow**:
  1. 사용자가 헤더의 `+ 여행` 버튼을 클릭한다
  2. 여행 제목 입력 다이얼로그가 표시된다
  3. 제목을 입력하고 저장 버튼을 누른다
- **Alternative Flow**: 제목이 비어 있으면 저장 버튼이 비활성화된다
- **Result**: 사이드바 TripList 에 새 여행이 추가되고 자동 선택된다

---

### UC-002. Leg(구간) 생성

- **Actor**: Primary User
- **Goal**: 출발 도시, 도착 도시, 교통수단, 날짜를 입력하여 여행 구간을 기록한다
- **Precondition**: 여행(Trip)이 하나 이상 존재한다
- **Main Flow**:
  1. 사용자가 사이드바에서 여행을 선택하고 `+ Leg` 버튼을 클릭한다
  2. 출발 도시 이름을 입력하면 Nominatim 자동완성 목록이 표시된다
  3. 자동완성 목록에서 도시를 선택하면 좌표가 자동으로 입력된다
  4. 같은 방식으로 도착 도시를 선택한다
  5. 교통수단(plane / train / car / bus / ship / walk)을 선택한다
  6. 출발 일시와 도착 일시를 입력한다
  7. 저장 버튼을 누른다
- **Alternative Flow**: 도시 검색 결과가 없으면 "검색 결과 없음" 메시지를 표시한다
- **Result**: 새 Leg가 사이드바 목록과 지도(마커 + 교통수단별 경로선)에 즉시 표시된다

---

### UC-003. 여행 경로 지도 확인

- **Actor**: Primary User
- **Goal**: 기록된 여행 구간을 지도 위에서 시각적으로 확인한다
- **Precondition**: Leg가 하나 이상 존재한다
- **Main Flow**:
  1. 사용자가 앱을 열거나 사이드바에서 여행을 선택한다
  2. 해당 여행의 도시 마커와 교통수단별 색상 경로선이 지도에 표시된다
  3. 마커 클릭 시 도시명·국가·방문 일시 팝업이 표시된다
- **Alternative Flow**: 저장된 Leg가 없으면 빈 지도와 "여행을 추가해보세요" 안내 메시지를 표시한다
- **Result**: 여행 경로가 지도에 시각화된다

---

### UC-004. Leg 수정 및 삭제

- **Actor**: Primary User
- **Goal**: 잘못 입력된 구간 정보를 수정하거나 제거한다
- **Precondition**: 수정/삭제할 Leg가 사이드바 목록에 존재한다
- **Main Flow**:
  1. 사이드바에서 대상 Leg의 편집 아이콘을 클릭한다
  2. 기존 값이 채워진 입력 폼이 표시된다
  3. 내용을 수정하고 저장 버튼을 누른다
  4. (삭제 시) 삭제 버튼 클릭 → 확인 다이얼로그 → 확인
- **Alternative Flow**: 확인 다이얼로그에서 취소 시 아무 변경 없이 닫힌다
- **Result**: 수정·삭제 내용이 지도와 사이드바 목록에 즉시 반영된다

---

### UC-005. 교통수단 필터

- **Actor**: Primary User
- **Goal**: 특정 교통수단의 Leg 만 지도에 표시한다
- **Precondition**: Leg가 두 개 이상 있고 교통수단이 다양하다
- **Main Flow**:
  1. 사이드바의 교통수단 필터(체크박스 6개) 중 일부를 선택·해제한다
  2. 선택된 교통수단에 해당하는 경로만 지도에 표시된다
- **Alternative Flow**: 모든 체크박스를 해제하면 전체 경로가 다시 표시된다 (= 전체 표시)
- **Result**: 선택한 조건에 맞는 경로만 지도에 렌더된다

> 참고: 특정 여행(Trip) 만 지도에 보고 싶을 때는 사이드바 TripList 에서 해당 여행을 선택한다 (별도 필터 UI 가 아닌 선택 인터랙션으로 처리).

---

### UC-006. JSON Export / Import

- **Actor**: Primary User
- **Goal**: 여행 데이터를 JSON 파일로 백업하거나 복원한다
- **Precondition**: (Export) 저장된 여행 데이터가 있다 / (Import) 유효한 JSON 파일이 있다
- **Main Flow**:
  1. 헤더의 `Export` 버튼 클릭 → 전체 Trip·Leg 데이터가 `.json` 파일로 다운로드된다
  2. 헤더의 `Import` 버튼 클릭 → 파일 선택 다이얼로그 → JSON 파일 선택
  3. "기존 데이터를 덮어쓸까요?" 확인 다이얼로그가 표시된다
  4. 확인 시 기존 `trips` 가 파일 내용으로 **완전히 교체**된다 (병합하지 않음)
- **Alternative Flow**:
  - 유효하지 않은 JSON 형식이면 오류 메시지를 표시하고 기존 데이터를 유지한다
  - 확인 다이얼로그에서 취소 시 기존 데이터를 유지한다
- **Result**: Export한 파일을 Import하면 동일한 여행 경로가 지도에 복원된다

---

## 3. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | 사용자는 여행(Trip)을 생성할 수 있다 | Must |
| FR-002 | 사용자는 여행에 구간(Leg)을 생성할 수 있다 | Must |
| FR-003 | 도시 이름을 검색하면 Nominatim이 좌표를 자동으로 반환한다 | Must |
| FR-004 | 사용자는 지도에서 도시 마커와 교통수단별 색상 경로선을 확인할 수 있다 | Must |
| FR-005 | 사용자는 Leg를 수정하거나 삭제할 수 있다 | Must |
| FR-006 | 사용자는 여행 데이터를 JSON 파일로 내보내기/가져오기할 수 있다 (Import 시 기존 데이터 덮어쓰기) | Must |
| FR-007 | 앱이 모든 변경 사항을 localStorage에 자동 저장한다 | Must |
| FR-008 | 사용자는 교통수단별로 지도 경로를 필터링할 수 있다 | Should |
| FR-009 | 마커 클릭 시 도시명·국가·방문 일시가 팝업으로 표시된다 | Should |
| FR-010 | 사용자는 Leg에 메모(note)를 선택적으로 남길 수 있다 | Nice |

---

## 4. Non-functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 | 모바일 화면(320px 이상)에서도 핵심 기능(Leg 추가·지도 확인)을 사용할 수 있어야 한다 |
| NFR-002 | 버튼과 입력 필드는 접근 가능한 `aria-label` 또는 연결된 `<label>`을 가져야 한다 |
| NFR-003 | API 키 등 민감한 정보는 `.env` 파일로 분리하며 GitHub 저장소에 커밋하지 않는다 |
| NFR-004 | MVP는 로그인 없이 단일 사용자 기준으로 동작한다 |
| NFR-005 | 외부 네트워크 의존(Nominatim 도시 검색 · OpenStreetMap 지도 타일) 외의 모든 기능은 오프라인에서도 동작해야 한다 |
| NFR-006 | Nominatim 호출은 1 req/sec 제한을 준수하기 위해 디바운스(300ms)를 적용한다 |

---

## 5. Acceptance Criteria

### AC-001. Trip 생성

```
Given  앱이 열려 있을 때
When   사용자가 `+ 여행` 버튼을 누르고 제목을 입력 후 저장하면
Then   사이드바 TripList 에 새 여행이 추가되고 자동 선택된다
```

### AC-002. Leg 생성

```
Given  사용자가 출발 도시, 도착 도시, 교통수단, 출발 일시, 도착 일시를 입력했을 때
When   저장 버튼을 누르면
Then   새 Leg가 사이드바 목록에 추가되고 지도에 마커 2개와 교통수단별 경로선이 표시된다
```

### AC-003. 지도 확인

```
Given  Leg가 하나 이상 있을 때
When   사용자가 앱 화면을 열거나 사이드바에서 여행을 선택하면
Then   해당 도시 마커와 교통수단별 색상 경로선이 지도에 렌더된다
```

### AC-004. Leg 수정 및 삭제

```
Given  사이드바 목록에 Leg가 있을 때
When   편집 후 저장 버튼을 누르거나 삭제를 확인하면
Then   변경 사항이 지도와 사이드바 목록에 즉시 반영된다
```

### AC-005. 교통수단 필터

```
Given  plane·train·car 등 다양한 교통수단의 Leg가 여러 개 있을 때
When   특정 교통수단 필터를 선택하면
Then   해당 교통수단의 경로만 지도에 표시되고 나머지는 숨겨진다
```

### AC-006. JSON Export / Import

```
Given  여행 데이터가 있을 때
When   Export 버튼을 누르면 전체 데이터가 .json 파일로 다운로드되고,
When   해당 파일을 Import → "기존 데이터를 덮어쓸까요?" 확인 → 확인을 누르면
Then   기존 trips 가 파일 내용으로 완전히 교체되고 동일한 Trip·Leg·경로가 지도에 복원된다
```

### AC-007. localStorage 자동 저장

```
Given  사용자가 Leg를 추가·수정·삭제했을 때
When   페이지를 새로고침하면
Then   변경 사항이 그대로 유지된다
```

---

## 6. Requirement Traceability Lite

| Requirement ID | Use Case | Acceptance Criteria | Test Candidate |
|---|---|---|---|
| FR-001 | UC-001 | AC-001 | E2E: create trip |
| FR-002 | UC-002 | AC-002 | E2E: create leg |
| FR-003 | UC-002 | AC-002 | Unit: geocode search & debounce |
| FR-004 | UC-003 | AC-003 | E2E: view map markers & polyline |
| FR-005 | UC-004 | AC-004 | E2E: edit / delete leg |
| FR-006 | UC-006 | AC-006 | E2E: export JSON → import JSON (overwrite confirm) |
| FR-007 | UC-001, UC-002, UC-004 | AC-007 | E2E: reload page after mutation |
| FR-008 | UC-005 | AC-005 | E2E: filter by transport type |
| FR-009 | UC-003 | AC-003 | E2E: click marker → popup visible |
| FR-010 | UC-002 | AC-002 | Unit: optional note field |
