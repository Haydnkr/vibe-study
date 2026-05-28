# Travel Map MVP — Technical Design

> ARCHITECTURE.md · REQUIREMENTS.md · UXSPEC.md 를 기반으로 작성된 기술 설계 문서입니다.

---

## 1. Architecture Overview

```
User Interaction
  → Next.js App (Static Export)
  → React UI Components (react-leaflet, Tailwind)
  → Zustand Client State
  → localStorage  ──→  JSON Export / Import (수동 백업/복원)
  → Nominatim API (도시 이름 → 좌표, 외부, 읽기 전용)
```

- 서버 없음. 전체 정적(Static Export) 빌드. Vercel / GitHub Pages 배포 가능
- 외부 네트워크 의존: Nominatim (도시 검색) + OpenStreetMap 타일 (지도 렌더) — 둘 다 읽기 전용
- 모든 여행 데이터는 브라우저 localStorage 에만 존재하고, 사용자가 직접 JSON 으로 백업

---

## 2. Tech Stack

| Area | Technology | 비고 |
|---|---|---|
| Framework | Next.js 14 (App Router) | Static Export (`output: 'export'`) |
| UI | React 18 + react-leaflet 4 | Leaflet 은 CSR only → `dynamic import { ssr: false }` |
| Language | TypeScript | strict mode |
| Style | Tailwind CSS | |
| State | Zustand | `persist` 미들웨어로 localStorage 자동 저장 |
| Map | Leaflet + OpenStreetMap | API 키 불필요 |
| Geocoding | Nominatim (OSM) | API 키 불필요. 300ms 디바운스, 1 req/sec 제한 준수 |
| Storage | localStorage + JSON Export/Import | 서버 DB 없음 |
| AI Coding | Claude Code | |
| Test | Playwright | 4회차에 추가 |
| Version Control | GitHub | |
| Deploy | Vercel 또는 GitHub Pages | 정적 빌드 |

---

## 3. Route Design

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing Page (Hero · Problem · Features · CTA) |
| `/app` | `src/app/app/page.tsx` | App Page (지도 + 여행 기록 전체 기능) |

---

## 4. Source Structure

```text
src/
  app/
    layout.tsx                      # Root layout (Tailwind, metadata)
    page.tsx                        # Landing Page
    app/
      page.tsx                      # App Page
    globals.css

  components/
    ui/
      Button.tsx                    # 공통 버튼
      Dialog.tsx                    # 삭제 확인 다이얼로그
      Input.tsx                     # 공통 텍스트 인풋
    layout/
      AppHeader.tsx                 # 타이틀 + Import / Export 버튼 + "+ 여행" 버튼
      TripSidebar.tsx               # 여행/Leg 목록 + TransportFilter 묶음

  features/
    trips/
      types.ts                      # Trip · Leg · City · Transport 타입 정의
      store.ts                      # Zustand store + localStorage persist
      components/
        LegCard.tsx                 # Leg 하나 표시 (도시·교통수단·날짜·메모) + 편집/삭제
        LegForm.tsx                 # Leg 입력 폼 (CitySearch · 메모 포함)
        TripList.tsx                # Trip 아코디언 목록 (선택 시 selectedTripId 갱신)
        TripCreateDialog.tsx        # "+ 여행" 클릭 시 제목 입력 모달
        EmptyState.tsx              # 데이터 없음 안내 + 추가 유도 (MapView 오버레이)

    map/
      components/
        MapView.tsx                 # Leaflet 지도 컨테이너 (dynamic, ssr: false)
        CityMarker.tsx              # 도시 마커 + 팝업 (이름·국가·날짜)
        TransportPolyline.tsx       # 교통수단별 색상 경로선

    search/
      geocode.ts                    # Nominatim fetch wrapper (디바운스 300ms)
      components/
        CitySearch.tsx              # 자동완성 도시 검색 인풋

    filter/
      components/
        TransportFilter.tsx         # 교통수단 체크박스 6개

  lib/
    transport.ts                    # 교통수단 색상·아이콘·레이블 상수
    storage.ts                      # JSON export (Blob 다운로드) / import (FileReader) 헬퍼
```

---

## 5. Data Model (TypeScript)

```ts
// src/features/trips/types.ts

export type Transport = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'walk';

export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Leg {
  id: string;          // crypto.randomUUID()
  from: City;
  to: City;
  transport: Transport;
  departedAt: string;  // ISO 8601
  arrivedAt: string;   // ISO 8601
  note?: string;
}

export interface Trip {
  id: string;
  title: string;
  legs: Leg[];         // 시간순 정렬 (departedAt asc)
}
```

---

## 6. State Design (Zustand)

```ts
// src/features/trips/store.ts

interface TripStore {
  trips: Trip[];
  selectedTripId: string | null;     // 사이드바에서 선택된 여행 (지도 포커스용)
  activeTransports: Transport[];     // 교통수단 필터 — 빈 배열이면 전체 표시

  // Trip CRUD
  addTrip: (title: string) => void;
  updateTrip: (tripId: string, title: string) => void;
  removeTrip: (tripId: string) => void;
  selectTrip: (tripId: string | null) => void;

  // Leg CRUD
  addLeg: (tripId: string, leg: Omit<Leg, 'id'>) => void;
  updateLeg: (tripId: string, leg: Leg) => void;
  removeLeg: (tripId: string, legId: string) => void;

  // Filter
  setActiveTransports: (transports: Transport[]) => void;

  // Import / Export
  exportJSON: () => void;                       // Blob 다운로드
  importJSON: (file: File) => Promise<void>;    // FileReader → 기존 trips 완전 교체 (병합 X)
}
```

`persist` 미들웨어: `trips` · `selectedTripId` · `activeTransports` 를 `localStorage` 키 `travel-map-store` 에 자동 저장.

**Import 정책**: `importJSON` 호출 시 사용자에게 "기존 데이터를 덮어쓸까요?" 확인을 받은 뒤 `trips` 를 파일 내용으로 **완전히 교체**한다 (병합하지 않음). 확인 다이얼로그는 호출 측(AppHeader)에서 처리한다.

---

## 7. Key Implementation Notes

### Leaflet CSR 처리

Leaflet 은 `window` 객체를 직접 참조하므로 SSR 에서 오류 발생.  
`MapView` 는 반드시 `next/dynamic` 으로 lazy import.

```ts
// src/app/app/page.tsx
const MapView = dynamic(() => import('@/features/map/components/MapView'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-gray-100 animate-pulse" />,
});
```

### Nominatim 호출 규칙

- 디바운스 300ms (CitySearch 입력)
- `User-Agent` 헤더에 앱 이름 포함 (Nominatim 정책 요구)
- 결과는 컴포넌트 로컬 state 에만 보관 (전역 캐시 불필요)

```ts
// src/features/search/geocode.ts
const BASE = 'https://nominatim.openstreetmap.org/search';

export async function searchCity(query: string): Promise<City[]> {
  const url = `${BASE}?q=${encodeURIComponent(query)}&format=json&limit=5`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'travel-map-mvp/1.0' },
  });
  const data = await res.json();
  return data.map((r: NominatimResult) => ({
    name: r.display_name.split(',')[0],
    country: r.address?.country ?? '',
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}
```

### 교통수단 시각 스타일

```ts
// src/lib/transport.ts
// 색상은 DESIGN.md `{colors.transport-*}` 토큰과 동일하게 유지한다.
export const TRANSPORT_STYLE: Record<Transport, { color: string; dash?: string; label: string; icon: string }> = {
  plane: { color: '#2563eb', dash: '8 4', label: '항공', icon: '✈️' },
  train: { color: '#16a34a',             label: '기차', icon: '🚆' },
  car:   { color: '#d97706',             label: '자동차', icon: '🚗' },
  bus:   { color: '#dc2626',             label: '버스', icon: '🚌' },
  ship:  { color: '#0891b2', dash: '6 3', label: '선박', icon: '🚢' },
  walk:  { color: '#6b7280', dash: '3 3', label: '도보', icon: '🚶' },
};
```

### JSON Export / Import

```ts
// src/lib/storage.ts

export function exportTrips(trips: Trip[]): void {
  const blob = new Blob([JSON.stringify({ version: 1, trips }, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `travel-map-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTrips(file: File): Promise<Trip[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { trips } = JSON.parse(e.target!.result as string);
        resolve(trips);
      } catch {
        reject(new Error('유효하지 않은 JSON 형식입니다.'));
      }
    };
    reader.readAsText(file);
  });
}
```

---

## 8. Environment & Config

```bash
# .env.local (민감 정보 없음 — Nominatim 은 키 불필요)
NEXT_PUBLIC_APP_NAME=Travel Map
```

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // 정적 빌드 (서버 없음)
  images: { unoptimized: true },
};
export default nextConfig;
```

`.env.local` 은 `.gitignore` 에 포함. 현재 MVP 에는 시크릿 없음.

---

## 9. 회차별 구현 범위

회차 단위의 작업 범위(Must / Should / Not Today)는 **DELIVERYPLAN.md** 가 단일 진실 공급원이다. 이 문서에서는 회차별 범위를 중복 정의하지 않는다.

- 2회차: [DELIVERYPLAN.md §3~6](DELIVERYPLAN.md) — 공통 베이스(route · shell · types · placeholder)
- 3회차: [DELIVERYPLAN.md §7~9](DELIVERYPLAN.md) — 핵심 기능(Leg CRUD · 지도 · 필터 · Export/Import)
- 4회차: [DELIVERYPLAN.md §10](DELIVERYPLAN.md) — E2E 테스트 · 리팩토링 · 배포

---

## 부록. Session 3 OpenSpec 트랙 기술 세부 (2026-05-28)

### 의존성 추가

| 패키지 | 버전 | 용도 |
|---|---|---|
| `zustand` | 5 | 글로벌 상태 + `persist` 미들웨어 |
| `leaflet` | 1.9.4 | 지도 렌더링 |
| `react-leaflet` | ^4.2.1 | React 18 호환 (v5는 React 19 요구) |
| `@types/leaflet` | latest | 타입 정의 |
| `tz-lookup` | ^6 | `(lat, lng) → IANA timezone` (오프라인, ~80KB) |

### Store 구조 (`src/features/trips/store.ts`)

Zustand `create()` + `persist` 미들웨어 + `StateCreator` 명시 타입.

```ts
interface TravelMapState {
  trips: Trip[];                  // persisted
  categories: Category[];         // persisted
  selectedTripId: string | undefined;  // persisted
  filterTransports: Transport[];  // persisted, default = TRANSPORTS
  hydrated: boolean;              // not persisted

  // 25 actions: createTrip / updateTripTitle / updateTripTags /
  // setTripCategory / reorderLegs / deleteTrip(cascade) /
  // addLeg / updateLeg / deleteLeg /
  // createCategory / updateCategory / deleteCategory(cleanup) /
  // selectTrip / toggleFilterTransport(min1) / resetFilter / replaceAll / ...
}
```

`onRehydrateStorage` 후처리에서 모든 City를 `ingestCity` 로 통과시켜 누락된 `timezone`을 보강한다.

### Selector 패턴

UI에 데이터 가공 로직이 새지 않도록 store에 selector를 집중:

| Selector | 용도 |
|---|---|
| `selectTripById` · `selectCategoryById` | 단건 조회 |
| `selectTripAccentColor(state, tripId)` | Trip → Category 색 (없으면 NEUTRAL) |
| `selectCityVisits(trips, filter?)` | `(name+country)` 단위 visit 집계 (마커용) |
| `selectVisibleLegs(trips, categories, filter?)` | 색 사전 해석 + 평탄화된 Leg 배열 (폴리라인용) |
| `selectTripBoundPoints(trips, tripId?)` | bounds fitting용 `[lat,lng][]` |

slice를 직접 받도록 설계해 `useMemo` 의존성이 정직하게 잡힘 (lint clean).

### 시간 처리 헬퍼 (`src/lib/timezone.ts`)

```ts
deriveTimezone(lat, lng): string             // tz-lookup wrapper, "UTC" fallback
resolveTimezone(city): string                 // city.timezone ?? derive
ingestCity(city): City                        // 누락 보강 (멱등)
localToUtc(localISO, ianaTz): string          // datetime-local 값을 UTC ISO로
formatLocal(utcISO, city, opts): string       // Intl.DateTimeFormat (DST 자동)
tzAbbreviation(ianaTz, at?): string           // "KST", "CEST" 등
```

### Static Export + Leaflet 호환성

- `MapView`는 `next/dynamic` + `ssr: false`로 import (기존 제약 그대로)
- Leaflet 기본 마커 아이콘 URL 번들 이슈 회피 위해 `DivIcon`(흰 점 + 짙은 테두리) 사용
- OSM 타일은 클라이언트에서 직접 fetch → 정적 export에서도 문제 없음

### Import 검증 파이프라인 (`src/lib/storage.ts`)

```
JSON.parse → 루트 객체 형식 → schemaVersion 확인 →
trips/categories 배열 형식 → per-entity validators
(Trip / Leg / City / Category)
   ↓ 어느 단계든 실패 → atomic reject (오류 메시지 + 경로) + 기존 데이터 보존
   ↓ 통과
post-process: 모든 City에 ingestCity 적용 (timezone 보강) → store.replaceAll
```

검증 라이브러리(Zod) 없이 ~250라인 수동 검증으로 처리.
