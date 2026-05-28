# Travel Map MVP — 아키텍처 & 스택

## 1. Product Summary

여행을 자주 다니는 사람이 어느 지역을 어떤 교통수단을 이용해서 다녀왔는지를 지도에 연결하여 표시해주는 프로그램.

- **Core Value**: 여행의 추억을 시각적으로 남긴다.
- **Target User**: 여행가 (타이핑 가능 수준)
- **MVP 핵심**: 날짜/도시/교통수단을 기록하면 지도 위에 경로가 그려진다.

## 2. 추천 스택

### Frontend
- **Vite + React + TypeScript** — 빠른 개발 서버, 정적 빌드로 배포 간단 (Vercel / Netlify / GitHub Pages 모두 가능)
- **react-leaflet + Leaflet** — OpenStreetMap 타일, API 키 불필요. 마커 / 폴리라인 / 팝업 지원
- **Tailwind CSS** — 입력 폼 · 사이드패널 빠르게 스타일링
- **Zustand** — 가벼운 전역 상태 (여행 데이터 관리). Redux는 과함

### 외부 서비스
- **Nominatim (OpenStreetMap)** — 도시 이름 → 좌표 자동 변환. 단일 API, 키 불필요
  - 비목표 "다중 외부 API 연동"과 충돌하지 않음 (단일 API)
  - Rate limit: 1 req/sec — 디바운스 필수

### 데이터 / 저장
- 평소엔 `localStorage` 에 자동 저장
- 사용자 액션으로 **JSON Export / Import** (브리프 요구사항)

### 테스트 / 배포 (4회차 대비)
- **Playwright** — 핵심 흐름 E2E
- **Vercel** 또는 **GitHub Pages** — 정적 배포

## 3. 데이터 모델

```ts
type Transport = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'walk';

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface Leg {
  id: string;
  from: City;
  to: City;
  transport: Transport;
  departedAt: string;  // ISO 8601
  arrivedAt: string;   // ISO 8601
  note?: string;
}

interface Trip {
  id: string;
  title: string;
  legs: Leg[];         // 시간순 정렬
}
```

### 교통수단별 시각 표현

| Transport | 색상     | 선 스타일 | 아이콘 |
| --------- | -------- | --------- | ------ |
| plane     | #2563eb  | 점선 호    | ✈️     |
| train     | #16a34a  | 실선      | 🚆     |
| car       | #f59e0b  | 실선      | 🚗     |
| bus       | #ef4444  | 실선      | 🚌     |
| ship      | #0891b2  | 점선      | 🚢     |
| walk      | #6b7280  | 점선      | 🚶     |

## 4. 폴더 구조

```
travel-map/
├─ src/
│  ├─ components/
│  │  ├─ MapView.tsx        // Leaflet 지도 + 마커 / 경로 렌더
│  │  ├─ LegForm.tsx        // 출발 / 도착 / 교통수단 / 날짜 입력
│  │  ├─ TripSidebar.tsx    // 여행 목록 + Import / Export
│  │  └─ TransportIcon.tsx
│  ├─ store/
│  │  └─ useTripStore.ts    // Zustand + localStorage persist
│  ├─ lib/
│  │  ├─ geocode.ts         // Nominatim 검색 (디바운스)
│  │  └─ transport.ts       // 교통수단별 색상 / 스타일
│  ├─ types.ts
│  ├─ App.tsx
│  └─ main.tsx
├─ tests/                   // (4회차) Playwright
├─ vite.config.ts
├─ tailwind.config.ts
└─ package.json
```

## 5. 화면 흐름

```
┌─────────────────────────────────────────────────┐
│ Header  [Travel Map]    [Import] [Export] [+여행] │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │                                      │
│          │                                      │
│ ▸ 여행 1 │            🗺️  Leaflet Map           │
│   · Leg1 │                                      │
│   · Leg2 │     도시 마커 + 교통수단 경로         │
│ ▸ 여행 2 │                                      │
│          │                                      │
│ [+ Leg]  │                                      │
└──────────┴──────────────────────────────────────┘
```

## 6. MVP 사용자 흐름 (1분 안에 첫 사용)

1. 앱 열기 → 빈 지도 + "여행 추가" 버튼
2. 여행 제목 입력 → 첫 Leg 입력 폼 자동 표시
3. 출발 도시 검색 (Nominatim) → 자동완성에서 선택
4. 도착 도시 검색 → 선택
5. 교통수단 선택 + 날짜 입력 → 저장
6. 지도에 마커 2개 + 연결선 즉시 표시
7. "+ Leg" 로 다음 구간 계속 추가

## 7. 회차별 마일스톤

| 회차 | 목표                                                     |
| ---- | -------------------------------------------------------- |
| 1    | 아키텍처 확정, 프로젝트 스캐폴딩, 지도 + 도시 입력 동작  |
| 2    | 교통수단별 경로 시각화, Leg 다중 추가, 사이드바          |
| 3    | JSON Import / Export, localStorage, 브라우저에서 기본 흐름 확인 |
| 4    | Playwright E2E, 정적 배포                                |

## 8. Non-goals (이번 MVP 제외)

- 사진 관련 기록
- 로그인 / 계정
- 결제
- 실시간 협업
- 대용량 파일 업로드
- 다중 외부 API 연동
- 복잡한 관리자 권한

---

## 부록. Session 3 OpenSpec 트랙 갱신 (2026-05-28)

본 ARCHITECTURE 작성 이후 `openspec-driven-dev` 브랜치에서 다음 구조 변경이 반영되었다. 자세한 결정 근거는 `openspec/changes/archive/2026-05-28-clarify-mvp-requirements/design.md` 참조.

### 신규 엔터티: Category

```ts
interface Category {
  id: string;        // UUID
  name: string;      // 사용자 지정 (예: "휴가", "출장")
  color: string;     // hex (예: "#ef4444")
}
```

Trip이 0개 또는 1개의 Category를 참조한다 (`Trip.categoryId?`). store에 top-level `categories: Category[]` 배열로 보관.

### 시각 채널 분리 정책

폴리라인·사이드바 강조 색은 **Trip의 Category 색만 따른다**. Category 없으면 `NEUTRAL_COLOR` (`#888888`) 폴백. 교통수단(Transport)은 색 채널에 영향을 주지 않으며 **아이콘 + dash 패턴 + 굵기**로만 시각 구분된다 (`src/lib/transport.ts` `TRANSPORT_STYLE`에서 `color` 키 제거됨).

### 시각 저장·표시 정책

`Leg.departedAt`/`arrivedAt`은 **UTC ISO 8601 고정 저장**. 표시·입력은 출발/도착지 도시의 IANA 시간대로 변환 (`src/lib/timezone.ts` `formatLocal`/`localToUtc`). `City.timezone`은 옵셔널이며 누락 시 `lat`/`lng`로 `tz-lookup`을 통해 자동 채워진다 (`ingestCity`).

### 데이터 모델 차이 (요약)

```ts
interface Trip { ...; categoryId?: string; tags?: string[]; }   // categoryId, tags 추가
interface City { ...; timezone?: string; }                       // timezone 추가
```

`tz-lookup` 의존성 추가 (~80KB, 정적 export 1회 다운로드).
