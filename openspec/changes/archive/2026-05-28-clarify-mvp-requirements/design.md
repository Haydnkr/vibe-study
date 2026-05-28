## Context

`REQUIREMENTS.md`는 FR/UC/AC 트레이서빌리티까지 갖춘 MVP 스펙이지만, explore 세션에서 다음 결손이 드러났다:

1. UC-005 ↔ FR-008 충돌 (필터 전체 해제 동작)
2. Trip 라이프사이클 비대칭 (생성만 있고 편집/삭제 미정의)
3. 시간대 처리 미정의 (departedAt/arrivedAt의 기준 TZ)
4. 다중 방문 마커 표현 미정의
5. Import 검증 깊이 미정의
6. 시각 채널 충돌 — TRANSPORT_STYLE 색과 Trip 색 의도가 한 채널을 두고 경합

본 design.md는 capability spec(`specs/<capability>/spec.md`)이 "WHAT"을 다룬 데 비해 "HOW"를 다룬다. Stack/제약은 기존 `ARCHITECTURE.md`·`TECHDESIGN.md`·`CLAUDE.md`를 따른다 (Next.js 14 Static Export, Zustand, Leaflet, Nominatim, localStorage 단일 저장소).

## Goals / Non-Goals

**Goals**:
- 결손 6건을 결정 사항으로 고정하고 capability spec 6개로 구조화
- 시각 채널을 명시적으로 분리 (색=Category, 패턴=Transport)
- 데이터 모델 변경 최소화 (Trip에 categoryId/tags, City에 timezone — 모두 옵셔널)
- 구버전 JSON 마이그레이션 path 보존
- 3회차 비교 실험(MD vs OpenSpec) 출발선 정렬

**Non-Goals**:
- 본 change는 구현하지 않는다. 결정과 spec 고정만 한다. 구현은 별도 change(`/opsx:apply`) 또는 `md-driven-dev` 브랜치에서.
- 새 외부 서비스/API 도입 X. Nominatim + OpenStreetMap 외 의존 추가 없음.
- 로그인·DB·사진 업로드는 여전히 MVP 제외.
- Trip 삭제 undo/휴지통 — 별도 change로.
- 사용자 정의 Category 색의 접근성(대비비) 검증 — 별도 NFR 검토 영역.

## Decisions

### D1. `City.timezone`은 옵셔널 필드 + 입구 보강

**선택**: `interface City { ...; timezone?: string }`. 모든 진입점(City 생성, Nominatim 결과 채택, JSON Import 후처리)에서 누락 시 `tz-lookup(lat, lng)`으로 채움.

**대안 비교**:
- (a) 옵셔널 + 보강 — 채택. AC-011(구버전 마이그레이션) 그대로 살아남고 검증 정책과 충돌 없음.
- (b) 필수 + 마이그레이션 레이어 분리 — 인프라 과잉. 한 필드 추가에 import 파이프라인 2단 분리는 과함.
- (c) `schemaVersion` 도입 — YAGNI. MVP는 스키마 변경 빈도 낮음.

**구현 메모**:
- 헬퍼 `ingestCity(c) → c.timezone ?? tzLookup(c.lat, c.lng)` 1개를 store action들이 통과.
- TypeScript 모델은 옵셔널 유지. 호출처는 `city.timezone ?? deriveTimezone(city)` 폴백.
- `tz-lookup` 패키지: 번들 ~80KB 수용 (정적 export 한 번에 다운로드, 캐시).

### D2. 색 채널 분리 — Category 색 / Transport 패턴

**선택**: 폴리라인 색 source는 소속 Trip의 Category 색만. `TRANSPORT_STYLE`에서 `color` 필드 삭제, `icon`·`dashArray`·`weight`만 유지. Category 없는 Trip은 중립 회색(#888888) 폴백.

**대안 비교**:
- (a) Trip.color 자유색을 폴리라인에 — 첫 결정이었으나 "색은 transport에서만" 제약과 직접 충돌. 철회.
- (b) Trip별 자유색 + transport별 dash — 자유도는 높으나 Category라는 의미 단위가 빠짐. 사용자 멘탈 모델("이 여행은 휴가 카테고리")과 멀어짐.
- (c) Category 색 + transport dash — 채택. 색=의미(분류), 패턴=수단. 채널 직교.

**구현 메모**:
- `src/lib/transport.ts`의 `TRANSPORT_STYLE` 구조 변경 (breaking) — color 제거.
- `TransportPolyline.tsx`는 `trip.categoryId` → categories[id].color 조회. undefined면 #888888.
- 사이드바 Trip 카드 좌측 띠 색도 동일 source 사용.

### D3. Leg 시각 — UTC 저장, 도시 TZ 표시, 현지시간 입력

**선택**:
- 저장: `Leg.departedAt`, `Leg.arrivedAt` = UTC ISO 8601
- 표시: 출발=from.timezone, 도착=to.timezone, `Intl.DateTimeFormat`으로 변환
- 입력: 사용자가 각 도시 현지시간 그대로 입력 → 저장 시 해당 city.timezone으로 해석 → UTC 변환

**대안 비교**:
- 사용자 입력 UX 측면: "도시 현지시간"이 사용자 멘탈모델("서울에서 10시에 떠나 파리에 13시 30분 도착")과 가장 가까움. UTC 직접 입력은 일반 사용자에게 적대적.
- DST 자동 처리는 `Intl.DateTimeFormat`이 IANA TZ DB에 의존하므로 별도 라이브러리(luxon/date-fns-tz) 필요 없음.

**구현 메모**:
- `LegForm.tsx`에 도시 선택 시 TZ 라벨(예: "Europe/Paris, CEST") 표시. 입력 필드 옆 헬퍼 텍스트.
- 입력값 변환 헬퍼: `localToUtc(localISO, ianaTz)` — `Date(localISO)`의 wall-clock을 ianaTz로 재해석하는 로직 (`Intl.DateTimeFormat` 또는 수동 offset 계산).
- 표시 헬퍼: `utcToLocal(utcISO, ianaTz)` — `Intl.DateTimeFormat`으로 포맷팅.

### D4. 다중 방문 — 마커 1개 + 시간순 팝업

**선택**: `(City.name, City.country)` 쌍을 unique key로 도시 집계. 마커 1개를 클릭하면 팝업에 모든 방문 항목을 시간순으로 렌더. 각 항목 = [transport icon, 도시 현지시간 일시].

**대안 비교**:
- 마커 N개 오프셋: 좌표 거짓말 + 폴리라인 끝점 모호 → 기각.
- `leaflet.markercluster`: 줌 레벨별 클러스터링이지 다중 방문 표현 아님. 같은 좌표면 결국 1점. 의존성 추가 비용 대비 효용 적음 → 기각.
- 마커 1개 + 팝업 N개: 채택. 의존성 추가 없음, 시각 노이즈 최소, FR-009 자연 확장.

**그룹 키 선택지**:
- `name + country` 채택. Nominatim 결과 정규화가 일관성을 보장.
- 좌표 반올림(lat/lng 소수점 2자리)은 같은 도시도 별개 마커로 분리되는 함정. 폴백 키로 쓸 수 있으나 MVP 단계에선 불필요.
- `accept-language=en` 헤더로 Nominatim 결과를 영문 정규화하여 다국어 검색 시 동일 키 보장 (개선 사항, 별도 task).

### D5. 필터 — 최소 1개 체크 강제

**선택**: UI 측에서 마지막 1개 체크박스를 disabled로 만든다. 툴팁으로 이유 안내. UC-005 대안 흐름("전체 해제 = 전체 표시")은 삭제.

**대안 비교**:
- (a) 전체 표시 (현 스펙) — 직관에 반함. 0개 체크 = 전체 표시는 마법 모드.
- (b) 빈 지도 — 사용자가 "왜 안 보이지" 혼란 가능.
- (c) 최소 1개 강제 — 채택. UI 약속과 데이터 의미가 직선적.

**UX 출구 부재 인정**: "지금 지도를 깨끗하게 보고 싶다"는 의도는 본 결정으로 봉쇄됨. 별도 "지도 경로 숨기기" 토글이 필요하면 후속 change로.

### D6. Import 검증 — 형식 + 필드 + 값 + 원자적 거부

**선택**: 3단 검증 (parse → 필드 → 값 범위/enum), 하나라도 invalid 시 전체 거부. timezone 누락은 검증을 통과시키고 후처리에서 보강.

**검증 도구**:
- 옵션 1: Zod 의존성 추가 — 타입 안전, 자동 메시지 생성.
- 옵션 2: 수동 검증 함수 — 의존성 0, 코드량 증가.
- 권장: MVP scope에서 Zod 추가 또는 100라인 미만 수동 검증 모두 수용 가능. tasks.md에서 1차 안 결정.

**오류 메시지**:
- 사용자가 어느 항목이 어느 이유로 실패했는지 알 수 있도록 첫 invalid 발견 시점을 명시. 예: `Leg #3.transport: "비행기" is not one of [plane, train, ...]`.

### D7. Trip CRUD 진입점 — TripList 카드 ⋮ 메뉴

**선택**: 사이드바 TripList의 각 카드 우측에 ⋮ 메뉴 (편집 / 삭제). 드래그로 Leg 순서 재배치는 LegCard 직접 드래그.

**대안**: 별도 Trip 상세 페이지 → MVP 범위 폭증. ⋮ 메뉴가 충분.

## Risks / Trade-offs

- **R1. `tz-lookup` 번들 ~80KB** → 정적 export는 한 번 다운로드 후 캐시. 첫 로드만 영향. 모바일 3G에서 체감 가능하지만 MVP 수용. 동적 import로 첫 City 추가 시점에 로드하는 최적화 가능 (후속).
- **R2. Nominatim 다국어 결과 정규화 불안정** → `name + country` 그룹 키가 한국어 검색 vs 영어 검색에서 분리될 가능성. Mitigation: 검색 호출 시 `accept-language=en` 강제. 또는 `osm_id`를 City에 추가 (모델 변경 1회). MVP 1차에선 영문 강제로 충분.
- **R3. datetime-local 입력의 wall-clock 의미가 사용자에게 명확하지 않음** → TZ 라벨 표시 + 헬퍼 텍스트로 인지. UTC 미리보기는 후속 개선.
- **R4. Category 자유 색 = 접근성(대비비) 책임이 사용자에게 위임됨** → MVP에서 색 검증 없음. 색 채도가 낮으면 회색 폴백과 구분 어려운 케이스 발생 가능. NFR로 후속 검토.
- **R5. cascade 삭제 undo 부재** → JSON Export로 백업 가능하지만 사용자 부주의로 데이터 손실 가능. 휴지통/undo는 별도 change.
- **R6. 필터 최소 1개 강제의 UX 출구 부재** → "다 끄고 싶다"는 의도 봉쇄. 별도 "경로 숨기기" 토글 후속.

## Migration Plan

본 change는 구현 아티팩트 (proposal/specs/design/tasks)만 생성한다. 마이그레이션 계획은 구현 시점의 tasks.md가 다룬다. 다만 데이터 마이그레이션 핵심:

1. **신규 필드 옵셔널 처리**: `Trip.categoryId`, `Trip.tags`, `City.timezone` 모두 옵셔널. 구버전 store/JSON에 누락되어도 런타임 에러 없음.
2. **앱 부팅 시 자동 보강**: store 하이드레이션 직후 모든 City를 순회하여 timezone 누락 시 채움. 단 1회 후 캐시.
3. **TRANSPORT_STYLE breaking**: color 필드 삭제. UI 컴포넌트 마이그레이션은 같은 PR에서.

## Open Questions

- **OQ1**: Category 관리 UI 위치 — 헤더에 별도 진입점 vs Trip 편집 화면 안에서 inline 생성?
- **OQ2**: Leg 순서 재배치 시 자동 시간 정렬과의 관계 — 사용자가 명시적으로 시간 역순 배치 허용? 경고만 띄움?
- **OQ3**: Import 검증 라이브러리 — Zod 도입 여부. (`package.json` 의존성 1개 vs 100라인 수동 검증)
- **OQ4**: `accept-language=en` 강제 시점 — 모든 Nominatim 호출 일괄 vs 사용자 설정으로 분기?
