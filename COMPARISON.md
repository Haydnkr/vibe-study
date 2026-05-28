# MD-driven vs OpenSpec-driven — Session 3 비교 노트

`md-driven-dev` 와 `openspec-driven-dev` 두 트랙으로 같은 MVP 범위(REQUIREMENTS.md FR-001~010)를 구현한 결과를 §15 비교 기준에 따라 정리한다.

---

## 1. 트랙 요약

| 항목 | `md-driven-dev` | `openspec-driven-dev` |
|---|---|---|
| 참조 자료 | ARCHITECTURE / REQUIREMENTS / UXSPEC / TECHDESIGN (MD only) | 동일 MD + OpenSpec change (`clarify-mvp-requirements`) → 6 capability spec |
| 결정 캡처 방식 | 채팅·커밋 메시지에 산재 | OpenSpec proposal/design/specs/tasks 4-아티팩트 + 아카이브 |
| 시작점 | session-2 baseline (2cbec36) | session-2 baseline + session-3b openspec propose (22a4ed2) |
| 최종 커밋 | `f12da79 session-3a: implement core features from MD design` | `9c3e558 refactor(map): apply priority 1+2 from React review` (+ §7 wrap) |

---

## 2. §15 기준별 비교

### 2.1 Requirement Coverage (FR-001~FR-010 빠짐 없는가)

| FR | md-driven-dev | openspec-driven-dev |
|---|---|---|
| FR-001 Trip 생성 | ✓ (TripCreateDialog) | ✓ |
| FR-002 Leg 생성 | ✓ | ✓ (TZ 라벨 + UTC 변환까지) |
| FR-003 도시 검색 | ✓ | ✓ |
| FR-004 지도 경로 | ✓ | ✓ (+ 다중방문 집계) |
| FR-005 Leg 수정/삭제 | ✓ | ✓ (store action만, UI는 LegForm 재진입) |
| FR-006 Export/Import | ✓ (단순 덮어쓰기) | ✓ (3단 검증 + 원자적 거부 + timezone 마이그) |
| FR-007 localStorage | ✓ | ✓ (+ hydration timezone backfill) |
| FR-008 필터 | ✓ (체크에 따라) | ✓ (+ 최소 1개 강제 = FR-017 명시화) |
| FR-009 마커 팝업 | ✓ (단순 도시명) | ✓ (다중 방문 시간순 목록 = FR-016) |
| FR-010 메모 | ✓ | ✓ |
| **추가 결손 보강** | — | FR-011~023 + AC-008~017 (Trip 라이프사이클 / Category / TZ / 검증 정책) |

**관찰**: 둘 다 FR-001~010은 커버. **OpenSpec 트랙은 MD에 누락되어 있던 가장자리(편집 후 화면 동기화, timezone 의미, 다중 방문 표현, import 검증 깊이 등)를 FR-011~023으로 명시 추가했음.**

### 2.2 Scope Control (Not Today 침범)

| 트랙 | Not Today 침범 | 비고 |
|---|---|---|
| md-driven-dev | 없음 (보고된 한) | scope 일반 통제됨 |
| openspec-driven-dev | 없음 | + §6.5 Leg 드래그·320px 모바일 분기를 명시적으로 deferred 처리 |

OpenSpec은 design.md의 Non-Goals 섹션에 의도적 deferral을 박아 향후 라운드 추적이 쉬움.

### 2.3 Implementation Order

```
md-driven-dev:        Trip → Leg → MapView → Filter (자연 순서)
openspec-driven-dev:  §1 setup → §2 temporal-model → §3 categorization →
                     §6 trip-mgmt → §4 map → §5 filter → §7 portability
                     (capability 단위로 묶음, 순서가 spec에 의해 강제됨)
```

OpenSpec 순서는 capability spec의 의존 그래프에 직접 묶여 있어 처음에는 답답하지만 중간에 길을 잃지 않음.

### 2.4 File Structure (TECHDESIGN §7 `src/features/` 준수)

둘 다 동일 구조 준수. OpenSpec 트랙은 `openspec/changes/archive/` + `openspec/specs/` 가 추가되어 코드 외 산출물 추적 가능.

### 2.5 Code Quality (중복 / 복잡도)

| 측면 | md-driven-dev | openspec-driven-dev |
|---|---|---|
| 색 채널 | transport에 직접 박혀 있음 (`TRANSPORT_STYLE.color`) | Category·Transport 분리. TRANSPORT_STYLE에서 `color` 제거 |
| timezone | 미정의 — wall-clock 그대로 저장 가능성 | UTC 저장, 도시 TZ 표시, ingestCity 1개로 통합 |
| 검증 | Import JSON 단순 파싱 | storage.ts에 3단 검증 + 원자적 거부 |
| selector 패턴 | 컴포넌트가 state를 직접 변형 | store.ts에 selector 집중, MapView refactor(`9c3e558`)로 단일 소스화 |

**OpenSpec 트랙이 결과적으로 결합도 낮은 구조**. spec이 결정을 박아둔 덕에 구현 시 임의 결정이 덜 발생.

### 2.6 UI Consistency (UXSPEC 준수)

둘 다 sidebar+map 분할·다이얼로그 패턴 일관. OpenSpec 트랙은 TripActionMenu ⋮ + CategoryManagerDialog + Import 확인 다이얼로그까지 UXSPEC 의도 확장.

### 2.7 Verifiability (AC 기준 테스트 가능성)

- md-driven-dev: AC-001~007 (7개)
- openspec-driven-dev: AC-001~017 (17개) + 6개 capability spec의 추가 `#### Scenario:` 약 24개

→ **OpenSpec 트랙이 자동화 E2E 시나리오 후보를 2.4배 보유**.

### 2.8 Claude Response Quality

체험적 관찰:

| 항목 | md-driven-dev | openspec-driven-dev |
|---|---|---|
| 의사결정 누락 시 행동 | "그냥 진행", 사용자에게 묻지 않고 임의 선택 자주 발생 | explore 모드에서 선택지 제시 후 사용자 결정 대기, design.md에 결정 근거 기록 |
| 모순 발견 | 구현 중 늦게 노출 | M1·M2 모순을 spec 정합성 검증에서 조기 포착 |
| 변경 추적 | 커밋 메시지 의존 | spec delta + tasks 체크박스로 명시 |
| 길어진 컨텍스트에서 일관성 | 후반부 결정이 초기 결정과 어긋남 가능 | spec이 비휘발 ground truth로 작동 |

---

## 3. 트레이드오프

### MD-driven 장점
- 초기 진입 비용 0
- 작은 변경에 오버헤드 거의 없음
- 결정이 빨라 단기 산출물이 빠르게 나옴

### MD-driven 약점
- 모호한 결정이 코드에 흩어짐
- 가장자리 케이스 잘 놓침 (timezone·다중방문·검증 깊이)
- 두 번째 라운드 시작 시 "왜 이렇게 했는지" 추적 어려움

### OpenSpec 장점
- 결정의 명시성: capability spec이 변경 비용을 떨어트림 (변경 시 어떤 spec을 깨는지 즉시 보임)
- 모순 조기 포착: spec 정합성 검증이 M1·M2 같은 충돌을 구현 전에 찾음
- 미정 영역 가시성: OQ1~OQ4를 design.md에 박아 미해결 부채를 시각화

### OpenSpec 약점
- 초기 비용: change 하나 만드는 데 30~40분 (proposal + design + 6 specs + tasks)
- 작은 변경에는 부적합 (CSS 한 줄 고치는데 change 만들기는 과함)
- spec 작성 자체에 SHALL/MUST 같은 규약 학습 필요

---

## 4. 결론 (이 프로젝트 한정)

- **결정 명확성**: OpenSpec ≫ MD
- **시각 채널 분리·timezone·검증 정책 같은 가장자리 정합성**: OpenSpec ≫ MD
- **단기 구현 속도**: MD ≧ OpenSpec
- **장기 변경 비용**: OpenSpec < MD (재방문 시 spec이 컨텍스트 복구를 담당)

OpenSpec은 **결정 비용이 코드 비용보다 큰 단계**에서 강함. 이 MVP는 "결정 누락"이 많은 단계여서 OpenSpec이 도움됨. 작은 라이브러리 / 일회성 스크립트는 굳이 OpenSpec 도입할 가치 적음.

---

## 5. 산출물 인덱스

- `openspec/specs/` — 6 capability spec (canonical)
- `openspec/changes/archive/2026-05-28-clarify-mvp-requirements/` — proposal/design/tasks 원본
- `REQUIREMENTS.md` — FR-001~023 + AC-001~017 (MD 트랙과 통합 가능)
- `DELIVERYPLAN.md §19` — Session 3 OpenSpec 트랙 결과 요약
- 본 문서 — 비교 노트
