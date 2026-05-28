# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Travel Map MVP — 방문한 도시와 교통수단을 지도 위에 경로로 시각화하는 단일 사용자 여행 기록 앱.

Full specs: `ARCHITECTURE.md`, `REQUIREMENTS.md`, `UXSPEC.md`, `TECHDESIGN.md`, `DELIVERYPLAN.md`

## Commands

```bash
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 정적 빌드 (output: export → out/)
npm run lint       # ESLint
npm run test:e2e   # Playwright E2E (4회차 추가 예정)
```

> npm을 사용한다. pnpm은 사용자 PC corepack 권한 제약으로 2회차 시점에 npm으로 결정.

## Architecture

Next.js 14 App Router, Static Export (`output: 'export'`). 서버 없음. 모든 데이터는 브라우저 `localStorage`에만 저장.

**Routes**: `/` Landing Page · `/app` App Page

**State**: Zustand store (`src/features/trips/store.ts`) — `persist` 미들웨어로 `localStorage` 키 `travel-map-store`에 자동 저장. Trip → Leg 계층 구조.

**Feature 디렉터리 구조**:
- `src/features/trips/` — Trip/Leg CRUD, Zustand store, 타입
- `src/features/map/` — Leaflet 지도, 도시 마커, 교통수단 경로선
- `src/features/search/` — Nominatim 도시 검색 (geocode.ts)
- `src/features/filter/` — 교통수단 체크박스 필터
- `src/lib/` — 교통수단 스타일 상수(`transport.ts`), JSON export/import(`storage.ts`)

## Key Constraints

**Leaflet은 SSR 불가** — `MapView`는 반드시 `next/dynamic` + `ssr: false`로 import해야 한다.

```ts
const MapView = dynamic(() => import('@/features/map/components/MapView'), { ssr: false });
```

**Nominatim rate limit** — `geocode.ts` 호출은 300ms 디바운스 필수. `User-Agent: travel-map-mvp/1.0` 헤더 포함.

**시각 채널 분리** — 폴리라인·사이드바 강조 색은 **Trip의 Category 색**에서만 결정한다 (`src/features/trips/store.ts`의 `categories`). Category가 없는 Trip은 `NEUTRAL_COLOR`(`#888888`) 폴백. 교통수단(Transport)은 색 채널에 영향을 주지 않으며, 아이콘·dash 패턴·굵기만 `src/lib/transport.ts`의 `TRANSPORT_STYLE`에서 참조한다.

**시각 저장·표시** — `Leg.departedAt`/`arrivedAt`은 항상 UTC ISO 8601로 저장한다. 표시·입력은 출발지/도착지 도시의 IANA 시간대 기준이며 `src/lib/timezone.ts`의 `formatLocal`/`localToUtc` 헬퍼를 사용한다. `City.timezone`은 옵셔널이고 누락 시 `ingestCity`가 `lat`/`lng`로 자동 채운다 (`tz-lookup`).

## Data Model

```ts
type Transport = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'walk';
interface City { name: string; country: string; lat: number; lng: number; }
interface Leg  { id: string; from: City; to: City; transport: Transport; departedAt: string; arrivedAt: string; note?: string; }
interface Trip { id: string; title: string; legs: Leg[]; }
```

## Scope Boundaries

**MVP에 포함**: Leg 생성·수정·삭제, 지도 경로 시각화, 교통수단 필터, JSON Export/Import, localStorage 자동저장.

**MVP에서 제외**: 로그인, 서버/DB, 사진 업로드, 실시간 협업, 다중 외부 API.

## OpenSpec Workflow

`DELIVERYPLAN.md` §7 의 3회차 비교 실험(`md-driven-dev` vs `openspec-driven-dev`)을 위해 OpenSpec이 설치되어 있다.

**슬래시 커맨드** (`.claude/commands/opsx/`):
- `/opsx:explore` — 아이디어 탐색·요구사항 명확화
- `/opsx:propose <idea>` — change 폴더 + proposal · specs · design · tasks 아티팩트 생성
- `/opsx:apply` — change의 task 체크리스트를 따라 구현
- `/opsx:archive` — 완료된 change를 `openspec/specs/` 로 이관

**디렉터리**:
- `openspec/changes/` — 진행 중 change 제안
- `openspec/specs/` — 아카이브된 스펙

OpenSpec change는 `openspec-driven-dev` 브랜치에서만 사용하고, `md-driven-dev` 브랜치는 기존 MD 문서만 참조한다 (비교 실험 무결성 유지).
