# Travel Map MVP — UX / UI Spec

> ARCHITECTURE.md 의 화면 흐름과 REQUIREMENTS.md 의 FR/AC를 기반으로 작성된 UX 명세입니다.

---

## 1. Design Reference

색상·타이포·간격·컴포넌트 토큰은 **DESIGN.md** 가 단일 진실 공급원이다. 이 문서는 UX 흐름·인터랙션·컴포넌트 책임만 정의하고, 시각 토큰은 중복으로 옮겨 적지 않는다.

핵심 원칙(요약):

- 지도가 주인공이다. 사이드바·랜딩은 흰 캔버스 + 잉크 톤을 유지하고, 브랜드 전압은 `{colors.transport-*}` 토큰에서만 가져온다.
- 교통수단 색상은 DESIGN.md `{colors.transport-*}` 토큰을 그대로 사용한다. 인라인 hex 금지.
- 폰트는 Inter (DESIGN.md §Typography). 모서리·간격은 `{rounded.*}` · `{spacing.*}` 토큰 참조.

---

## 2. Screen Map

| Screen | Route | Purpose |
|---|---|---|
| Landing Page | `/` | 서비스 소개와 앱 진입 |
| App Page | `/app` | 핵심 기능 사용 (지도 + 여행 기록) |

---

## 3. Landing Page

### Purpose

서비스의 문제, 가치, 핵심 기능을 설명하고 사용자를 앱 화면으로 이동시킨다.

### Required Sections

| Section | 내용 요약 |
|---|---|
| Hero | Headline + Subheadline + CTA 버튼. 세계 지도 배경 또는 그라데이션 |
| Problem | "여행 기록은 있지만 한눈에 볼 수가 없다" — 공감 포인트 2–3개 |
| Core Features | 앱이 해결하는 것 3가지 (아이콘 + 한 줄 설명) |
| CTA Button | 하단 재노출. Landing 끝까지 읽은 사용자를 앱으로 이동시킨다 |

### Key Copy

| 위치 | 텍스트 |
|---|---|
| **Headline** | 내 여행, 지도 위에 그리다 |
| **Subheadline** | 방문한 도시와 이동 수단을 기록하면, 나만의 여행 지도가 완성됩니다 |
| **CTA** | 지금 시작하기 → `/app` |

### Section 상세

#### Hero
```
[세계 지도 배경 or 연한 그라데이션]

  내 여행, 지도 위에 그리다

  방문한 도시와 이동 수단을 기록하면,
  나만의 여행 지도가 완성됩니다.

  [ 지금 시작하기 → ]
```

#### Problem
```
  "도시 목록은 있는데, 어떤 순서로 갔는지 한눈에 안 보여요."
  "항공·기차·버스를 섞어서 여행했는데 이동 경로를 정리하기 어렵고,"
  "나중에 추억을 되살리려면 메모를 일일이 뒤져야 했어요."
```

#### Core Features
| 아이콘 | 제목 | 설명 |
|---|---|---|
| 📍 | 도시 기록 | 방문한 도시를 검색하면 지도에 자동으로 핀이 꽂힙니다 |
| ✈️ | 경로 시각화 | 교통수단별 색상으로 이동 경로를 연결해 보여줍니다 |
| 💾 | 데이터 보관 | 여행 기록을 JSON으로 내보내고 언제든 복원할 수 있습니다 |

---

## 4. App Page

### Purpose

사용자가 실제 기능을 수행하는 화면이다.

### Layout (데스크톱)

```
┌─────────────────────────────────────────────────────┐
│ AppHeader │ Travel Map  [Import] [Export] [+ 여행]   │
├──────────────┬──────────────────────────────────────┤
│  Sidebar     │                                      │
│              │                                      │
│  TripList    │           MapView                    │
│  ▸ 여행 1   │    (Leaflet + 마커 + 경로선)           │
│    · Leg 1   │                                      │
│    · Leg 2   │                                      │
│  ▸ 여행 2   │                                      │
│              │                                      │
│  FilterArea  │                                      │
│  ✈ 🚆 🚗 …  │                                      │
│              │                                      │
│  [+ Leg 추가]│                                      │
└──────────────┴──────────────────────────────────────┘
```

### Layout (모바일, 320px+)

```
┌────────────────────────┐
│ AppHeader              │
│ Travel Map  ☰ 메뉴     │
├────────────────────────┤
│                        │
│       MapView          │
│   (전체 화면 비율)       │
│                        │
├────────────────────────┤
│  하단 시트: LegForm     │
│  / TripList / Filter   │
└────────────────────────┘
```

### Required Areas

| Area | 설명 | 비고 |
|---|---|---|
| **Header** | "Travel Map" 타이틀 + Import / Export 버튼 + "+ 여행 추가" 버튼 | 항상 상단 고정 |
| **MapView** | Leaflet 지도. 도시 마커·교통수단 경로선 렌더. 마커 클릭 → 팝업 | 화면 중앙, 최대 영역 |
| **Input Form** | LegForm: 출발/도착 도시 검색 + 교통수단 선택 + 날짜 입력 + 저장 | 사이드바 또는 모달 |
| **Filter Area** | 교통수단 체크박스 6개 (plane / train / car / bus / ship / walk) | 사이드바 하단 |
| **List Area** | TripSidebar: 여행 아코디언 → Leg 카드 (도시·교통수단·날짜) | 사이드바 |
| **Empty State** | Trip / Leg 없을 때 — "아직 기록된 여행이 없어요" + "+ 여행 추가" 유도 | MapView 영역 중앙에 오버레이 (사이드바에는 표시하지 않음) |
| **Status Action** | LegCard 내 편집(✏️) / 삭제(🗑️) 아이콘 버튼 | hover 또는 항상 표시 |

---

## 5. Component Plan

| Component | Purpose | Requirement Link |
|---|---|---|
| `AppHeader` | 앱 타이틀, Import / Export 버튼, "+ 여행" 버튼 | FR-001, FR-006 |
| `TripCreateDialog` | "+ 여행" 클릭 시 표시되는 제목 입력 모달. 제목 빈 값이면 저장 비활성화 | FR-001 |
| `MapView` | Leaflet 지도 + 도시 마커 + 교통수단별 색상 경로선 + 마커 팝업 | FR-004, FR-008, FR-009 |
| `TripSidebar` | 여행(Trip) 아코디언 목록. 여행 선택 시 `selectedTripId` 설정 → 지도가 해당 경로로 포커스 | FR-004, FR-005 |
| `LegCard` | Leg 하나 표시 (출발→도착, 교통수단 아이콘, 날짜, 메모 한 줄). 편집·삭제 버튼 포함 | FR-005, FR-010 |
| `LegForm` | 출발·도착 도시 입력, 교통수단 선택, 날짜 입력, **메모(선택)** 입력, 저장 버튼 | FR-002, FR-003, FR-010 |
| `CitySearch` | Nominatim 자동완성 검색 인풋 (디바운스 300ms). LegForm 내에서 사용 | FR-003 |
| `TransportFilter` | 교통수단 체크박스 6개. 선택 해제 시 해당 경로선 지도에서 숨김 | FR-008 |
| `EmptyState` | Leg / Trip이 없을 때 MapView 중앙에 안내 메시지 + 추가 유도 버튼 | FR-004 |

---

## 6. Interaction Rules

1. **LegForm 초기화**: Leg 저장 후 모든 입력 필드(메모 포함)는 빈 값으로 초기화된다.
2. **저장 버튼 비활성화**: 출발 도시·도착 도시·교통수단·출발 일시 중 하나라도 누락이면 저장 버튼이 `disabled` 상태가 된다. (메모는 선택)
3. **Trip 생성 다이얼로그**: `+ 여행` 클릭 시 제목 입력 모달이 열린다. 제목이 빈 값이면 저장 버튼이 `disabled`.
4. **지도 즉시 반영**: Trip / Leg 저장·수정·삭제 시 페이지 새로고침 없이 MapView 가 즉시 업데이트된다.
5. **필터 즉시 반영**: TransportFilter 체크박스 변경 시 MapView 경로선이 즉시 업데이트된다.
6. **도시 검색 디바운스**: CitySearch 입력 후 300ms 이 지나야 Nominatim API 를 호출한다.
7. **삭제 확인**: LegCard 의 삭제 버튼을 누르면 "정말 삭제하시겠어요?" 확인 다이얼로그가 먼저 표시된다.
8. **Import 덮어쓰기 확인**: Import 파일 선택 후 "기존 데이터를 덮어쓸까요?" 확인 다이얼로그가 표시되며, 확인 시에만 `trips` 가 교체된다.
9. **지도 자동 포커스**: Leg 저장 또는 사이드바에서 Trip 선택 시 지도가 해당 경로(들)를 포함하는 범위로 자동 줌/이동한다.
10. **모바일 사이드바 토글**: 모바일(< 768px) 에서 헤더의 `☰` 버튼을 누르면 하단 시트가 열리며, TripList / LegForm / TransportFilter 를 탭으로 전환할 수 있다. 외부 영역 탭 또는 닫기 버튼으로 닫힌다.

---

## 7. Accessibility Rules

- 모든 입력 필드(`CitySearch`, 날짜, 교통수단 선택)에는 연결된 `<label>` 또는 `aria-label` 이 있어야 한다.
- 버튼 텍스트(또는 `aria-label`)는 기능을 명확히 설명해야 한다. (예: "삭제" ❌ → "서울→도쿄 Leg 삭제" ✅)
- 교통수단은 색상과 함께 **아이콘 + 텍스트 레이블**로도 구분한다. (색맹 사용자 대응, NFR-002)
- 주요 영역은 heading 구조를 가진다: `<h1>` Travel Map → `<h2>` 여행 제목 → `<h3>` Leg 구간
- 모달·다이얼로그 열릴 때 포커스가 해당 요소로 이동하고, 닫힐 때 트리거 버튼으로 복귀한다.
- 키보드만으로 Leg 추가·수정·삭제·필터 변경이 가능해야 한다.

---

## 부록. Session 3 OpenSpec 트랙 UX 갱신 (2026-05-28)

### 헤더 진입점 (AppHeader)

| 버튼 | 기능 | 동작 |
|---|---|---|
| **카테고리** | Category 관리 다이얼로그 | name + HTML5 color picker, 인라인 편집/삭제 |
| **Import** | JSON 가져오기 | 파일 선택 → 검증 → "기존 데이터를 덮어쓸까요?" 확인 다이얼로그 → 토스트 |
| **Export** | JSON 내보내기 | `travel-map-YYYY-MM-DD.json` 자동 다운로드 + 토스트 |
| **+ 여행** | TripCreateDialog | 제목 입력 → 저장 → 자동 선택 |

성공/실패 안내는 우상단 토스트로 4.5초간 표시 (`role="status"`, `aria-live="polite"`).

### Trip ⋮ 메뉴 (TripList 카드)

각 Trip 카드 우측에 `⋮` 트리거. 클릭하면 popover에 다음 두 항목:
- **편집** → `TripEditDialog` (제목 · 태그 쉼표 구분 · Category 선택)
- **삭제** → `TripDeleteConfirm` ("이 여행의 Leg N개도 함께 삭제됩니다")

popover는 외부 클릭·ESC로 닫힌다 (focus trap).

### Trip 카드 색상

좌측 띠 4px가 Trip의 Category 색을 사용. Category 없으면 `#888888`. 사용자가 Category를 부여하면 즉시 띠 색 + 지도 폴리라인 색이 동시 갱신된다.

### LegForm TZ 안내

도시(`from`/`to`) 선택 시 입력 필드 아래에 `ⓘ Europe/Paris, CEST 현지시간으로 입력` 형태의 헬퍼 텍스트가 노출된다. 사용자가 datetime-local 컨트롤에 입력한 wall-clock 값이 그 도시의 현지시간으로 해석됨을 명확히 안내.

### 교통수단 필터 비활성화 안내

체크된 transport가 1개일 때 그 마지막 체크박스는 disabled. 라벨에 `title` 속성으로 "최소 1개 교통수단을 선택해야 합니다" 툴팁을 노출. 시각적으로 opacity 60%, cursor `not-allowed`.

### 마커 팝업 콘텐츠 (다중 방문 N회)

```
Paris  France
─────────────────────────────
✈️ 2026. 08. 01. 13:30 (CEST) (도착)
🚆 2026. 08. 05. 08:00 (CEST) (출발)
🚌 2026. 08. 08. 15:00 (CEST) (도착)
```

- 헤더: 도시명 + 국가 (작은 회색)
- 각 visit: transport 아이콘 + 도시 현지시간 (TZ 라벨 동반) + 출발/도착 kind
- 시간 순 정렬

### Import 확인 다이얼로그

```
기존 데이터를 덮어쓸까요?
현재 store는 Trip 1개 · Category 2개 상태입니다.
Import 파일은 Trip 1개 · Category 1개로 완전히 교체됩니다.
병합하지 않습니다. 이 작업은 되돌릴 수 없습니다.
[취소]  [덮어쓰기]
```

병합이 아닌 **완전 교체**임을 명시. 취소 버튼이 좌측, 위험 액션이 우측.
