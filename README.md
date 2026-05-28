# Travel Map MVP

방문한 도시와 교통수단을 지도 위에 경로로 시각화하는 **단일 사용자 여행 기록 앱**.

> 학습 목적의 비교 실험 — 같은 MVP 범위를 **MD-driven** vs **OpenSpec-driven** 두 트랙으로 개발하여 결과 비교.

---

## 배포 URL

| 브랜치 | 용도 | URL |
|---|---|---|
| `main` | Session 2 baseline (placeholder 상태) | `TBD — Vercel import 후 채우세요` |
| `md-driven-dev` | MD 문서만 보고 구현한 결과 | `TBD — preview deployment URL` |
| `openspec-driven-dev` | OpenSpec spec 기반 구현 결과 (풀 기능) | `TBD — preview deployment URL` |

> Vercel 배포 절차는 본 문서 하단 **Deploy** 섹션 참고.

---

## 빠르게 보기

```bash
git clone https://github.com/Haydnkr/vibe-study.git
cd vibe-study
git checkout openspec-driven-dev   # 풀 기능
npm install
npm run dev                         # http://localhost:3000/app
```

`/app` 페이지에서 우상단 **+ 여행** → 제목 입력 → **카테고리** 추가 → Trip ⋮ 편집으로 카테고리 부여 → **+ Leg 추가**로 도시 검색·시각 입력 → 지도에 폴리라인·마커가 표시됩니다.

---

## 핵심 기능 (FR 대응)

| 기능 | FR | 상태 |
|---|---|---|
| Trip · Leg CRUD (생성·수정·삭제) + cascade | FR-001/002/005/011/012 | ✓ |
| Nominatim 도시 검색 + 300ms 디바운스 | FR-003 | ✓ |
| Leaflet 지도 · 폴리라인 · 다중 방문 마커 | FR-004/009/016 | ✓ |
| **UTC 저장 · 도시 IANA TZ 표시** (`tz-lookup`) | FR-013/014 | ✓ |
| 교통수단 필터 + 최소 1개 강제 | FR-008/017 | ✓ |
| **Category** 엔터티 (이름·색) + Trip 부여 | FR-019/020 | ✓ |
| **시각 채널 분리**: 색=Category, 패턴=Transport | FR-021/022 | ✓ |
| Category cascade-cleanup (참조 Trip은 보존) | FR-023 | ✓ |
| JSON Export · Import (3단 검증 · 원자적 거부) | FR-006/018 | ✓ |
| 구버전 JSON `timezone` 자동 마이그레이션 | FR-014 | ✓ |
| localStorage persist + hydration backfill | FR-007 | ✓ |
| Leg 메모(note) | FR-010 | ✓ |

상세 요구사항: `REQUIREMENTS.md` · capability specs: `openspec/specs/`

---

## 스택

```
Next.js 14.2.18   App Router + Static Export (output: 'export')
React 18.3.1      Hook 기반, client-only state
TypeScript        strict mode
Tailwind CSS      유틸리티 우선 디자인 시스템
Zustand 5         persist 미들웨어로 localStorage 자동 저장
Leaflet 1.9.4     지도 렌더링
react-leaflet 4   React 바인딩 (v5는 React 19 요구라 v4 고정)
tz-lookup         lat/lng → IANA timezone 결정 (~80KB)
Nominatim         OpenStreetMap 도시 검색 (외부 API, debounce 300ms)
```

서버 함수 0개. Vercel Hobby(무료) 플랜으로 충분.

---

## 디렉터리 구조

```
src/
├── app/                       Next.js App Router
│   ├── page.tsx                Landing
│   └── app/page.tsx            App shell + 모든 다이얼로그 오케스트레이션
├── components/
│   ├── layout/AppHeader.tsx    상단 헤더 + Export/Import + 카테고리/+여행 진입
│   └── ui/Dialog.tsx           모달 primitive (ESC + click-outside)
├── features/
│   ├── trips/
│   │   ├── store.ts             Zustand persist + selectors + 25 actions
│   │   ├── types.ts             Trip/Leg/City/Category 타입
│   │   └── components/          TripList · TripActionMenu · TripCreateDialog
│   │                            TripEditDialog · TripDeleteConfirm
│   │                            CategoryManagerDialog · LegForm · LegCard
│   │                            EmptyState
│   ├── map/components/         MapView · TransportPolyline · CityMarker
│   ├── search/                 Nominatim wrapper + CitySearch autocomplete
│   └── filter/components/      TransportFilter
└── lib/
    ├── transport.ts             TRANSPORT_STYLE (icon, dash, weight) + NEUTRAL_COLOR
    ├── timezone.ts              deriveTimezone, localToUtc, formatLocal, ingestCity
    └── storage.ts               Export blob + Import 3-stage validation
```

---

## OpenSpec 트랙 산출물

`openspec/specs/` 에 capability 단위 spec 6개가 canonical 상태로 보관됨:

- `trip-management` · `categorization` · `temporal-model`
- `map-visualization` · `transport-filter` · `data-portability`

`openspec/changes/archive/2026-05-28-clarify-mvp-requirements/` 에 결정 캡처 4-아티팩트 (proposal · design · specs · tasks).

비교 실험 결과: **`COMPARISON.md`**

---

## 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 정적 빌드 → out/ (5 정적 페이지)
npm run lint     # ESLint
```

---

## Deploy (Vercel)

1. https://vercel.com/new → Import `Haydnkr/vibe-study`
2. 자동 감지: Framework Preset = Next.js, Build Command = `npm run build`, Output Directory = `out`
3. **Deploy** — ~2분 후 production URL 발급 (main = baseline)
4. **Preview Deployments**: 푸시된 다른 브랜치(`md-driven-dev`, `openspec-driven-dev`) 별 자동으로 별도 URL 생성
5. 무료 Hobby 플랜으로 충분 (서버 함수 0개, 정적 export)

배포 후 위 **배포 URL** 섹션에 받은 URL 3개를 채우면 됩니다.

---

## Known Limitations / Deferred

| 항목 | 이유 | 처리 |
|---|---|---|
| **모바일 320px 전용 레이아웃** | sidebar 폭 고정으로 좁은 화면에서 지도가 안 보임 | 후속 라운드 (NFR-001) |
| **Leg 드래그로 순서 변경** | `@dnd-kit` 등 추가 의존성 비용 vs MVP scope | 별도 change 후속 |
| **Trip cascade 삭제 undo / 휴지통** | MVP scope 외, JSON Export로 백업 가능 | 별도 change 후속 |
| **Category 색 대비비 검증** | 사용자 자유 색 → 회색 폴백과 구분 어려운 경우 발생 가능 | NFR 후속 검토 |
| **Playwright E2E 자동화** | Session 4 계획 | DELIVERYPLAN §10 |
| **`design.md` OQ1~OQ4 미해결** | Category UI 위치(헤더 채택)·Leg 정렬·Zod 도입(거절)·`accept-language=en`(적용) — 일부 임시 결정 | 향후 라운드에서 정식화 |

---

## 브랜치 정책

| 브랜치 | 정책 |
|---|---|
| `main` | Session 2 baseline 유지 (비교 실험 무결성). 머지하지 않음. |
| `md-driven-dev` | 동결. 비교 노트의 raw 산출물. |
| `openspec-driven-dev` | 동결. 본 README의 실사용 가능 결과물. |

새 기능을 main에 통합하고 싶다면 `openspec-driven-dev` 를 main에 별도 PR로 머지하되, 그 시점에 비교 노트 (`COMPARISON.md`) 결과는 이미 보관된 상태이므로 머지 자유.

---

## 라이선스 / 참고

- Project planning: `ARCHITECTURE.md`, `REQUIREMENTS.md`, `UXSPEC.md`, `TECHDESIGN.md`, `DELIVERYPLAN.md`
- OpenSpec workflow: https://github.com/Fission-AI/OpenSpec
- 지도 타일: © OpenStreetMap contributors
- 도시 검색: Nominatim (OSM)
- TZ DB: tz-lookup (IANA timezone database)
