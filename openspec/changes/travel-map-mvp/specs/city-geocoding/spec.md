## ADDED Requirements

### Requirement: Nominatim 도시 검색
The system SHALL provide a CitySearch input that queries Nominatim (`nominatim.openstreetmap.org`) with the user's text and renders an autocomplete dropdown of up to 5 results, each containing city name, country, and lat/lng.

#### Scenario: 검색 결과 표시
- **WHEN** 사용자가 CitySearch 인풋에 도시명을 입력하면 (300ms 디바운스 경과 후)
- **THEN** Nominatim API 가 호출되고 최대 5개 결과가 드롭다운에 표시된다

#### Scenario: 결과 선택 시 좌표 자동 입력
- **WHEN** 사용자가 드롭다운에서 도시를 선택한다
- **THEN** 해당 City 객체(name, country, lat, lng)가 폼에 채워지고 드롭다운이 닫힌다

#### Scenario: 검색 결과 없음
- **WHEN** Nominatim 응답이 빈 배열일 때
- **THEN** "검색 결과 없음" 안내 텍스트가 드롭다운 자리에 표시된다

### Requirement: 디바운스 (rate limit 보호)
The system SHALL debounce CitySearch queries by 300 ms; consecutive keystrokes within the window MUST cancel any pending request.

#### Scenario: 연속 입력 시 단일 요청
- **WHEN** 사용자가 100ms 간격으로 5글자를 연속 입력한다
- **THEN** Nominatim 은 정확히 한 번만 호출된다 (마지막 입력 후 300ms 경과 시점)

#### Scenario: 컴포넌트 unmount 시 cleanup
- **WHEN** 디바운스 타이머가 살아있는 동안 CitySearch 컴포넌트가 unmount 된다
- **THEN** 보류 중인 요청은 cleanup 되고 발사되지 않는다

### Requirement: 외부 API 실패 안전 처리
The system SHALL handle Nominatim non-2xx responses or network errors by treating the result as an empty list (no crash, no stale state).

#### Scenario: 5xx 응답
- **WHEN** Nominatim 이 5xx 를 반환한다
- **THEN** 드롭다운은 빈 결과 또는 "검색 결과 없음" 으로 표시되고 사용자는 다시 입력해 재시도할 수 있다
