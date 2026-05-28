# Travel Map MVP — Delivery Plan

> 2회차 후반부터 4회차까지의 개발 실행 계획.  
> ARCHITECTURE.md · REQUIREMENTS.md · UXSPEC.md · TECHDESIGN.md 를 기반으로 작성한다.

---

## 1. 문서 목적

이 문서는 2회차 후반부터 4회차까지의 개발 실행 계획을 정리한다.  
전체 MVP를 한 번에 구현하지 않고, 공통 베이스와 핵심 기능을 단계적으로 구현하기 위한 기준으로 사용한다.

---

## 2. 전체 개발 목표

최종 목표는 4회차 종료 시 배포 가능한 Travel Map MVP를 완성하는 것이다.

최종 산출물:

- Landing Page (`/`) — 서비스 소개 + CTA
- App Page (`/app`) — 지도 + 여행 기록 전체 기능
- 핵심 기능 (Leg 생성·수정·삭제, 지도 경로 시각화, JSON Export/Import)
- GitHub 저장소
- Playwright E2E 테스트 또는 수동 QA 결과
- 배포 가능한 URL (Vercel 또는 GitHub Pages)
- README

---

## 3. Session 2 Goal

2회차에서는 전체 프로젝트의 약 20~30%를 완성한다.

### 2회차 완료 기준

- Next.js 프로젝트(Static Export)가 준비되어 있다.
- `/` route 가 존재한다.
- `/app` route 가 존재한다.
- Landing Page 초안이 있다.
- App Page shell(AppHeader + Sidebar + MapView 영역)이 있다.
- `types.ts` — Trip · Leg · City · Transport 타입이 정의되어 있다.
- 주요 컴포넌트 placeholder 파일이 존재한다.
- mock data 또는 빈 상태가 준비되어 있다.
- `pnpm dev` 로 실행 가능하다.

---

## 4. Session 2 Must Have

| Task | Description | Done When |
|---|---|---|
| Project scaffold | Next.js 14 + Tailwind + TypeScript 프로젝트 생성 (`output: 'export'`) | `npm run dev` 실행 가능 |
| Landing route | `/` 페이지 생성 (Hero · Problem · Features · CTA) | 브라우저에서 `/` 접속 가능 |
| App route | `/app` 페이지 생성 (AppHeader + Sidebar + MapView 영역 분할) | 브라우저에서 `/app` 접속 가능 |
| Type definition | `src/features/trips/types.ts` — Trip · Leg · City · Transport 타입 작성 | 컴파일 오류 없음 |
| Component placeholders | MapView · LegForm · TripList · LegCard · TripCreateDialog · TransportFilter · EmptyState 파일 생성 | 각 파일이 빈 컴포넌트라도 렌더됨 |
| Empty state | Leg 없을 때 "아직 기록된 여행이 없어요" 문구 표시 | `/app` 에서 Empty State 확인 |

---

## 5. Session 2 Should Have

| Task | Description | Done When |
|---|---|---|
| Mock data | `src/features/trips/mockData.ts` — 샘플 Trip 1개 (Leg 3개: 서울→파리 ✈️ · 파리→암스테르담 🚆 · 암스테르담→바르셀로나 🚌) | `/app` 에서 샘플 데이터 목록 확인 가능 |
| Basic layout | AppHeader 고정 + 좌측 Sidebar + 우측 MapView 영역 분할 | 화면이 큰 틀에서 정돈됨 |
| Basic styling | Tailwind 기반 최소 스타일 (카드·폼·헤더) | 화면이 읽을 수 있는 수준 |
| Filter placeholder | TransportFilter 체크박스 6개 UI (로직 없음) | 화면에 교통수단 필터 표시 |

---

## 6. Session 2 Not Today

2회차에서는 아래 기능을 구현하지 않는다.

- Zustand store + localStorage 연동 (CRUD 실제 동작)
- Nominatim 도시 검색 API 연동
- Leaflet 지도 실제 마커·경로선 렌더
- JSON Export / Import
- 복잡한 상태 관리
- DB 연동
- 로그인
- 결제
- 실시간 협업
- Playwright 테스트 코드 작성
- 배포

---

## 7. Session 3 Goal

3회차에서는 같은 요구사항을 두 방식으로 구현하고 비교한다.

### 비교 방식

1. **MD 설계 문서 기반 개발** — ARCHITECTURE.md · REQUIREMENTS.md · UXSPEC.md · TECHDESIGN.md 참조
2. **OpenSpec change 기반 개발** — OpenSpec 변경 사항 참조

### 3회차 목표

- 핵심 기능 구현 (Leg 생성 · 지도 경로 시각화 · 필터 · Leg 편집/삭제)
- 요구사항 반영도 비교
- 범위 통제 비교
- 코드 구조 비교
- Claude Code 응답 품질 비교

---

## 8. Session 3 Must Have

| Task | Related Requirement | Done When |
|---|---|---|
| Trip + Leg 생성 | FR-001, FR-002 | 여행 생성 후 출발·도착 도시, 교통수단, 날짜를 입력하고 저장하면 목록에 추가됨 |
| 도시 검색 (Nominatim) | FR-003 | 도시 이름 입력 시 자동완성 결과가 표시되고 선택 시 좌표 입력 |
| 지도 경로 시각화 | FR-004 | Leg 저장 후 지도에 도시 마커와 교통수단별 색상 경로선이 표시됨 |
| 교통수단 필터 | FR-008 | 체크박스 선택·해제 시 지도 경로선이 즉시 업데이트됨 |

---

## 9. Session 3 Should Have

| Task | Description |
|---|---|
| Leg 수정 | LegCard 편집 아이콘 → 기존 값이 채워진 LegForm → 저장 시 지도 즉시 반영 |
| Leg 삭제 | 삭제 확인 다이얼로그 → 확인 시 목록·지도에서 제거 |
| localStorage persist | Zustand `persist` 미들웨어 연동. 새로고침 후에도 데이터 유지 (FR-007) |
| 마커 팝업 | 도시 마커 클릭 시 도시명·국가·방문 일시 팝업 표시 (FR-009) |
| JSON Export / Import | `src/lib/storage.ts` 구현. 헤더 버튼으로 데이터 백업·복원, Import 시 덮어쓰기 확인 (FR-006) |
| 메모(note) 입력 | LegForm 에 선택 입력 필드, LegCard 에 한 줄 표시 (FR-010) |

---

## 10. Session 4 Goal

4회차에서는 테스트, 리팩토링, 배포를 진행한다.

### 4회차 목표

- Playwright E2E 테스트 작성 (AC-001 ~ AC-007 커버)
- TDD 흐름 체험
- 리팩토링
- README 정리
- 정적 빌드 (`pnpm build`) + 배포 (Vercel 또는 GitHub Pages)
- 최종 발표

---

## 11. Manual QA for Session 2

2회차 종료 전 확인할 항목:

- [ ] `npm run dev` 로 앱이 실행된다.
- [ ] `/` 페이지가 열리고 Headline "내 여행, 지도 위에 그리다" 가 보인다.
- [ ] `/app` 페이지가 열리고 AppHeader · Sidebar · MapView 영역이 구분된다.
- [ ] 큰 TypeScript 컴파일 오류가 없다.
- [ ] Landing Page 에 Hero · Problem · Core Features · CTA 섹션이 보인다.
- [ ] App Page 에 EmptyState 또는 mock data 가 표시된다.
- [ ] MapView · LegForm · TripList · LegCard · TransportFilter placeholder 가 존재한다.
- [ ] 모바일 너비(320px)에서 큰 레이아웃 깨짐이 없다.
- [ ] 오늘 구현 범위(Not Today)를 넘는 기능이 들어가지 않았다.

---

## 12. Verification Commands

```bash
npm run dev
npm run build
git status
```

선택적으로 실행:

```bash
npm run lint
```

---

## 13. Branch Plan

3회차 비교 실험을 위해 브랜치를 나눈다.

```text
main
├── md-driven-dev
└── openspec-driven-dev
```

### MD 기반 개발 브랜치

```bash
git checkout -b md-driven-dev
```

### OpenSpec 기반 개발 브랜치

```bash
git checkout main
git checkout -b openspec-driven-dev
```

---

## 14. Development Prompts

### 공통 베이스 구현 프롬프트

```text
ARCHITECTURE.md · REQUIREMENTS.md · UXSPEC.md · TECHDESIGN.md 와
OpenSpec change를 모두 참고해서
오늘 구현할 공통 베이스 20~30%만 제안해 주세요.

조건:
- MD 기반 개발과 OpenSpec 기반 개발 비교를 방해하지 않는 공통 구조만 만드세요.
- CRUD 전체 구현은 하지 마세요.
- 로그인, DB, 외부 API는 넣지 마세요.
- route, shell, types.ts, placeholder 컴포넌트 중심으로 계획하세요.
- 아직 파일은 수정하지 말고 수정할 파일과 구현 순서만 제안하세요.
```

### 구현 승인 프롬프트

```text
좋습니다. 제안한 계획대로 구현해 주세요.

조건:
- ARCHITECTURE.md · REQUIREMENTS.md · UXSPEC.md · TECHDESIGN.md 범위를 벗어나지 마세요.
- 복잡한 기능은 만들지 마세요.
- CRUD 전체는 구현하지 마세요.
- 오늘은 route, 화면 shell, types.ts, placeholder 컴포넌트까지만 구현하세요.
- 구현 후 변경된 파일 목록과 `pnpm dev` 실행 방법을 요약해 주세요.
```

---

## 15. Comparison Criteria for Session 3

3회차에서 두 방식의 결과를 비교할 때 볼 기준:

| Criteria | Question |
|---|---|
| Requirement Coverage | FR-001 ~ FR-010 이 빠짐없이 구현되었는가? |
| Scope Control | Not Today 항목이 추가되지 않았는가? |
| Implementation Order | Trip → Leg → MapView → Filter 순서가 자연스러웠는가? |
| File Structure | TECHDESIGN.md 의 `src/features/` 구조를 따랐는가? |
| Code Quality | 중복과 복잡도가 적절한가? |
| UI Consistency | UXSPEC.md 의 컴포넌트·인터랙션 규칙을 따랐는가? |
| Verifiability | AC-001 ~ AC-007 기준으로 QA 또는 테스트가 가능한가? |
| Claude Response Quality | 계획, 요약, 검증 설명이 명확했는가? |

---

## 16. Risks

| Risk | Mitigation |
|---|---|
| 기능 범위가 커짐 | Must / Should / Not Today 로 명확히 분리 |
| 구현 시간이 부족함 | 2회차는 베이스(route · shell · types · placeholder)까지만 |
| 문서와 구현이 어긋남 | 구현 전 planning-review 프롬프트 실행 |
| OpenSpec이 과하게 커짐 | tasks 를 10~20분 단위로 제한 |
| Leaflet SSR 오류 | `next/dynamic` + `ssr: false` 로 처리 (TECHDESIGN.md §7 참조) |
| Nominatim rate limit 위반 | 디바운스 300ms + User-Agent 헤더 필수 (TECHDESIGN.md §7 참조) |
| 학생별 진도 차이 | Must Have 중심으로 진행, Should Have 는 시간 여유 시 추가 |

---

## 17. Commit Plan

2회차 종료 시 커밋 (저장소 초기화가 필요한 경우 `git init` 선행):

```bash
git init                                # 신규 저장소인 경우만
git add .
git commit -m "session-2: add planning docs and baseline scaffold"
git remote add origin <repo-url>        # 신규 저장소인 경우만
git push -u origin main                 # 최초 푸시
```

3회차 MD 기반 개발 커밋:

```bash
git commit -m "session-3a: implement core features from MD design"
```

3회차 OpenSpec 기반 개발 커밋:

```bash
git commit -m "session-3b: implement core features from OpenSpec design"
```

---

## 18. Final Checklist

2회차 종료 전 확인:

* [ ] ARCHITECTURE.md 작성 완료
* [ ] REQUIREMENTS.md 작성 완료
* [ ] UXSPEC.md 작성 완료
* [ ] TECHDESIGN.md 작성 완료
* [ ] DELIVERYPLAN.md 작성 완료
* [ ] OpenSpec change 생성
* [ ] 공통 베이스 구현 (`npm run dev` 실행 확인)
* [ ] `/` route 확인 — Landing Page Hero 노출
* [ ] `/app` route 확인 — AppHeader · Sidebar · MapView 영역 노출
* [ ] `src/features/trips/types.ts` 핵심 타입 정의
* [ ] placeholder 컴포넌트 생성 (MapView · LegForm · TripList · LegCard · TripCreateDialog · TransportFilter · EmptyState)
* [ ] `npm run dev` + `npm run build` 오류 없음 확인
* [ ] Git commit / push 완료

---

## 19. Session 3 결과 — OpenSpec 트랙 (2026-05-28)

`openspec-driven-dev` 브랜치에서 다음이 적용되었다 (커밋 `cdf7e75` → `9c3e558` → §7 wrap):

### 캡처된 결정 (clarify-mvp-requirements change → archived)

6개 capability spec이 `openspec/specs/`로 promote됨:
- `trip-management` · `categorization` · `temporal-model` · `map-visualization` · `transport-filter` · `data-portability`

### 구현된 기능 (FR 매핑)

| 영역 | FR | 상태 |
|---|---|---|
| Trip CRUD + cascade | FR-001, FR-002, FR-005, FR-011, FR-012, FR-015 | ✓ |
| Trip ⋮ 메뉴 + 편집 다이얼로그 + 삭제 확인 | FR-011, FR-012 | ✓ |
| Category 엔터티 (UUID + name + color) | FR-019, FR-020 | ✓ |
| 폴리라인 색 = Category, 패턴 = Transport | FR-021, FR-022 | ✓ |
| Category 삭제 시 Trip 보존 | FR-023 | ✓ |
| UTC 저장 + 도시 TZ 표시 (`tz-lookup`) | FR-013, FR-014 | ✓ |
| Nominatim 도시 검색 300ms 디바운스 | FR-003 | ✓ |
| 실 Leaflet 지도 + 폴리라인 + 다중방문 마커 | FR-004, FR-009, FR-016 | ✓ |
| 교통수단 필터 최소 1개 강제 | FR-008, FR-017 | ✓ |
| JSON Export · Import 3단 검증 · 원자적 거부 · timezone 마이그레이션 | FR-006, FR-018 | ✓ |
| localStorage persist + hydration backfill | FR-007 | ✓ |
| 메모(note) 입력/표시 | FR-010 | ✓ |

### 추가 의존성

`zustand` · `leaflet` · `react-leaflet@^4` · `@types/leaflet` · `tz-lookup`

### 후속 라운드 (deferred)

- §6.5 Leg 드래그 재배치 (의존성 비용 vs MVP scope)
- 모바일 320px 레이아웃 분기 (NFR-001)
- Category 색 대비비 검증 (NFR 후속)
- §9 일부 AC 자동화 E2E (4회차 Playwright)

### 비교 실험 노트

`md-driven-dev` vs `openspec-driven-dev` 비교는 `COMPARISON.md`에 별도 정리.
