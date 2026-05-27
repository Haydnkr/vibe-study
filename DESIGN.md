---
version: alpha
name: TravelMap-design
description: A quiet, cartographic interface anchored on white canvas and dark-ink type, where the map is always the hero. Brand voltage comes from transport-signature color stripes — blue for air, green for rail, amber for car, coral for bus, teal for ship, gray for walk — that punctuate the sidebar and landing page. Primary actions use a near-black pill CTA; secondary actions sit in a white outlined button. Type runs Inter at modest weights — never bold for its own sake. The sidebar stays editorially calm so the map can breathe.

colors:
  primary: "#181d26"
  primary-active: "#0d1218"
  ink: "#181d26"
  body: "#374151"
  muted: "#6b7280"
  hairline: "#e5e7eb"
  border-strong: "#9ca3af"
  canvas: "#ffffff"
  surface-soft: "#f9fafb"
  surface-strong: "#e5e7eb"
  surface-dark: "#181d26"
  surface-dark-elevated: "#1d2230"
  signature-sky: "#1e3a5f"
  signature-terrain: "#14532d"
  signature-sand: "#f5e9d4"
  signature-sunrise: "#7c2d12"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  link: "#2563eb"
  link-active: "#1e40af"
  success: "#15803d"
  success-border: "#4ade80"
  error: "#dc2626"
  error-border: "#f87171"
  transport-plane: "#2563eb"
  transport-train: "#16a34a"
  transport-car: "#d97706"
  transport-bus: "#dc2626"
  transport-ship: "#0891b2"
  transport-walk: "#6b7280"

typography:
  display-xl:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.01em
  display-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  title-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  title-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  label-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.02em
  transport-badge:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em

rounded:
  xs: 2px
  sm: 6px
  md: 8px
  lg: 12px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 12px 20px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 12px 20px
    border: "1px solid {colors.hairline}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 6px 10px
  button-icon:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    size: 36px
    border: "1px solid {colors.hairline}"
  app-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    height: 56px
    borderBottom: "1px solid {colors.hairline}"
  trip-sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    width: 280px
    borderRight: "1px solid {colors.hairline}"
    padding: 16px
  leg-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px
    border: "1px solid {colors.hairline}"
  leg-card-active:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border-strong}"
  leg-form:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 20px
    border: "1px solid {colors.hairline}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
    height: 40px
    border: "1px solid {colors.hairline}"
  text-input-focus:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.link}"
  transport-badge:
    typography: "{typography.transport-badge}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  transport-filter-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
    border: "1px solid {colors.hairline}"
  transport-filter-chip-active:
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  empty-state:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 48px 24px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 80px 48px
  signature-sky-card:
    backgroundColor: "{colors.signature-sky}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  signature-terrain-card:
    backgroundColor: "{colors.signature-terrain}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  feature-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  cta-band:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    padding: 48px
---

## Overview

Travel Map의 UI는 지도가 항상 주인공이다. 베이스는 흰 캔버스, 진한 잉크 타입, 넉넉한 여백이고 — 좌측 사이드바는 의도적으로 조용하게 유지된다. 지도와 경쟁하지 않는다.

브랜드 전압은 **교통수단 시그니처 색상**에서 온다. 항공(sky blue), 철도(terrain green), 선박(ocean teal), 자동차(amber), 버스(coral red) — 이 색상들이 LegCard의 왼쪽 accent 바, TransportFilter 칩, 그리고 지도 경로선에서 일관되게 사용된다. 랜딩 페이지에서는 `{component.signature-sky-card}`와 `{component.signature-terrain-card}`가 섹션 전환점에서 브랜드 전압을 발휘한다.

타입은 Inter at 모노한 웨이트 — 400이 본문, 500이 서브타이틀과 버튼, 600이 display headline. 강조는 굵기가 아니라 크기와 색상 대비로 한다.

**핵심 설계 원칙:**
- 지도가 언제나 최대 영역을 차지한다. 사이드바는 지도 위에 overlay되지 않는다 (모바일 제외).
- Primary CTA는 `{colors.primary}` (near-black) — 여행 앱이라도 파란 버튼을 쓰지 않는다.
- 교통수단 색상은 `transport-*` 토큰으로만 참조한다. 인라인 하드코딩 금지.
- LegCard는 왼쪽 3px solid border로 교통수단 색상을 나타낸다 — 배경을 칠하지 않는다.
- Section rhythm (랜딩): 흰 hero → sky 시그니처 카드 → 흰 본문 → terrain 카드 → 흰 CTA 밴드 → footer.

---

## Colors

### Brand & Base
- **Primary** (`{colors.primary}` — #181d26): Primary CTA 배경, 최상위 display 타입, `{component.app-header}` 로고 타입에 사용. 여행 앱에서 파란색 primary를 사용하고 싶은 충동을 이 토큰이 막는다.
- **Primary Active** (`{colors.primary-active}` — #0d1218): Primary 버튼 press 상태.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): 모든 페이지의 기본 표면. 사이드바, 카드, 폼 배경.
- **Surface Soft** (`{colors.surface-soft}` — #f9fafb): Active LegCard, EmptyState 배경, feature-card 배경.
- **Surface Strong** (`{colors.surface-strong}` — #e5e7eb): CTA 밴드 배경 (랜딩 하단).
- **Surface Dark** (`{colors.surface-dark}` — #181d26): 다크 시그니처 카드. `{colors.primary}`와 동일한 hex — 잉크 색과 다크 서피스는 같은 역할의 다른 레이어이다.
- **Hairline** (`{colors.hairline}` — #e5e7eb): 카드 테두리, 사이드바 구분선, 인풋 아웃라인.

### Text
- **Ink** (`{colors.ink}` — #181d26): h1~h3 display 타입, 버튼 텍스트(라이트 배경).
- **Body** (`{colors.body}` — #374151): 본문 카피, LegCard 도시명.
- **Muted** (`{colors.muted}` — #6b7280): 날짜, 메모, 보조 레이블, EmptyState 텍스트.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): Primary 버튼과 시그니처 카드 위의 텍스트.

### Transport Signature Colors
교통수단별 색상은 지도 경로선, LegCard accent bar, TransportFilter 칩 활성 상태에서 일관되게 사용된다. 배경색으로 사용하지 않는다 (LegCard 배경은 항상 canvas).

| Token | Hex | 교통수단 | 선 스타일 |
|---|---|---|---|
| `{colors.transport-plane}` | #2563eb | 항공 ✈️ | 점선 호 (dash: 8 4) |
| `{colors.transport-train}` | #16a34a | 기차 🚆 | 실선 |
| `{colors.transport-car}` | #d97706 | 자동차 🚗 | 실선 |
| `{colors.transport-bus}` | #dc2626 | 버스 🚌 | 실선 |
| `{colors.transport-ship}` | #0891b2 | 선박 🚢 | 점선 (dash: 6 3) |
| `{colors.transport-walk}` | #6b7280 | 도보 🚶 | 점선 (dash: 3 3) |

### Landing Signature Card Surfaces
- **Signature Sky** (`{colors.signature-sky}` — #1e3a5f): 딥 네이비 시그니처 카드 — 항공 여행, 지도의 깊이를 연상시킨다. 흰 텍스트.
- **Signature Terrain** (`{colors.signature-terrain}` — #14532d): 딥 그린 시그니처 카드 — 육로 여행, 자연. 흰 텍스트.
- **Signature Sand** (`{colors.signature-sand}` — #f5e9d4): 크림/샌드 콜아웃 — 따뜻한 기억, 소프트한 강조. 잉크 텍스트.
- **Signature Sunrise** (`{colors.signature-sunrise}` — #7c2d12): 선라이즈 다크 오렌지 카드 — 섹션 변주용, 스페어링하게 사용.

### Semantic
- **Link** (`{colors.link}` — #2563eb): 인라인 텍스트 링크. `{colors.transport-plane}`과 같은 hex — 하늘색 계열이 앱 내 "정보 링크"를 담당한다.
- **Success** / **Error**: 폼 유효성 검사, Toast 메시지에만 사용.

---

## Typography

### Font Family
**Inter** (Google Fonts, variable font). 웹폰트 로드 전략: `font-display: swap`, `preconnect fonts.googleapis.com`. 시스템 폴백: `system-ui, -apple-system, sans-serif`.

Haas Grotesk (Airtable 원본)와 다른 점: Inter는 cap-height가 살짝 낮아 line-height를 5% 높여 보정한다. 이 spec의 line-height 값은 이미 보정되어 있다.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | 사용처 |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 600 | 1.1 | -0.02em | 랜딩 히어로 h1 |
| `{typography.display-lg}` | 40px | 500 | 1.15 | -0.01em | 랜딩 섹션 h2 |
| `{typography.display-md}` | 32px | 500 | 1.2 | -0.01em | 시그니처 카드 헤드라인 |
| `{typography.title-lg}` | 24px | 500 | 1.35 | 0 | 사이드바 여행 제목 |
| `{typography.title-md}` | 20px | 500 | 1.4 | 0 | 섹션 서브타이틀 |
| `{typography.title-sm}` | 18px | 500 | 1.4 | 0 | LegForm 레이블 그룹 제목 |
| `{typography.label-md}` | 14px | 500 | 1.4 | 0 | 앱 헤더 타이틀, 카드 레이블 |
| `{typography.button}` | 15px | 500 | 1.4 | 0 | CTA 버튼 텍스트 |
| `{typography.body-md}` | 14px | 400 | 1.6 | 0 | 본문 카피, LegCard 도시명 |
| `{typography.body-sm}` | 13px | 400 | 1.5 | 0 | 날짜, 메모, 보조 정보 |
| `{typography.caption}` | 12px | 500 | 1.35 | 0.02em | TransportFilter 레이블, 팝업 메타 |
| `{typography.transport-badge}` | 12px | 600 | 1.2 | 0.04em | LegCard 교통수단 배지 |

### Principles
- 강조는 크기 → 색상 → 굵기 순서로 선택한다. 굵기는 마지막 수단이다.
- 앱 페이지 (사이드바)는 display size 사용 금지 — `{typography.title-lg}` 이하만 사용.
- `{typography.transport-badge}`의 `font-weight: 600`과 `letter-spacing: 0.04em`은 이 컨텍스트에서만 허용된 예외다. 다른 곳에 600을 사용하지 않는다.

---

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 80px.
- **랜딩 섹션 패딩:** `{spacing.section}` (80px) top + bottom.
- **사이드바 내부 패딩:** `{spacing.md}` (16px).
- **카드 내부:** LegCard `{spacing.sm}` (12px), LegForm `{spacing.md}` (20px), 시그니처 카드 `{spacing.xxl}` (48px).

### App Page Layout

```
┌─ 56px AppHeader (border-bottom: hairline) ──────────────────┐
├─ 280px Sidebar ──────┬─ flex-1 MapView ─────────────────────┤
│  border-right: hairline│                                     │
│  overflow-y: auto    │   Leaflet 지도 (100% h/w)            │
│                      │   마커 + 교통수단 경로선              │
│  TripList            │                                       │
│  TransportFilter     │                                       │
│  [+ Leg 추가]        │                                       │
└──────────────────────┴─────────────────────────────────────-─┘
```

- 사이드바는 고정폭 `280px`. 지도는 나머지 전체.
- AppHeader는 `position: sticky top-0 z-50`으로 스크롤에 고정.
- 사이드바는 `overflow-y: auto`; 지도는 `overflow: hidden`.

### Landing Page Layout

```
[hero-band]           — 흰 캔버스, 80px padding
[logo-strip]          — 파트너/도구 로고 (선택)
[feature-section]     — feature-card 3열
[signature-sky-card]  — 전폭 딥 네이비 callout
[feature-section-2]   — 추가 설명 영역
[signature-terrain-card] — 전폭 딥 그린 callout
[cta-band]            — 연회색 CTA 배너
[footer]
```

- Max content width: 1280px, centered. 좌우 padding `{spacing.xxl}` (48px).
- 두 시그니처 카드 사이에는 반드시 흰 섹션이 한 개 이상 있다.

### Whitespace Philosophy
앱 페이지: 사이드바는 조밀하게, 지도는 최대한 여백 없이 꽉 채운다. 카드와 카드 사이 간격 `{spacing.xs}` (8px).  
랜딩 페이지: 히어로는 `{spacing.section}` (80px) 여백. 섹션 간 여백은 동일하게 80px. 배경 장식 없음.

---

## Elevation & Depth

| Level | Treatment | 사용처 |
|---|---|---|
| Flat | 그림자 없음, 테두리 없음 | 지도 영역, AppHeader, Footer |
| Hairline | 1px `{colors.hairline}` 테두리 | LegCard, text-input, button-secondary |
| Soft card | `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` | LegForm 패널 (지도 위 overlay 시) |
| Focus ring | `0 0 0 2px {colors.link}` outline | 키보드 포커스 상태 |

그림자는 최소화한다. 깊이는 `{colors.canvas}` vs 시그니처 색상 카드의 색상 대비로 표현한다.

### Transport Accent as Depth
LegCard의 교통수단 색상은 배경이 아니라 왼쪽 `3px solid border`로 표현한다. 이는 색상 정보를 전달하면서도 카드 배경을 canvas로 유지해 가독성을 보호한다.

```
┌──────────────────────────────┐
│▌ ✈️ 서울 → 파리              │  ← 3px transport-plane border
│   2024-03-15  14h 30m        │
│   ✏️  🗑️                    │
└──────────────────────────────┘
```

---

## Shapes

### Border Radius Scale

| Token | Value | 사용처 |
|---|---|---|
| `{rounded.xs}` | 2px | 사용 없음 (법적 버튼 없음) |
| `{rounded.sm}` | 6px | text-input, body-sm 인라인 배지 |
| `{rounded.md}` | 8px | LegCard, feature-card, TransportFilter 칩 |
| `{rounded.lg}` | 12px | Primary/Secondary CTA, LegForm 패널, 시그니처 카드 |
| `{rounded.pill}` | 9999px | TransportFilter 활성 칩, TransportBadge |
| `{rounded.full}` | 9999px | 도시 마커 아바타 |

### Map Marker Geometry
도시 마커: `{rounded.full}` 원형 + 교통수단 색상 외곽선. 기본 지름 12px, 선택 시 16px. 팝업은 `{rounded.md}` (8px) 흰 카드.

---

## Components

> **hover 상태 미문서화.** Default와 Active/Pressed 상태만 문서화한다.

### Buttons

**`button-primary`** — 앱의 유일한 near-black CTA. 배경 `{colors.primary}`, 텍스트 `{colors.on-primary}`, padding 12px × 20px, `{rounded.lg}` (12px). "저장", "+ 여행 추가", "지금 시작하기"에 사용. 뷰포트당 하나만 사용한다.

**`button-secondary`** — 아웃라인 버튼. 흰 배경 + `{colors.ink}` 텍스트 + 1px `{colors.hairline}` 테두리. "Import", "Export", "취소"에 사용. `{component.button-primary}`의 자연스러운 쌍.

**`button-ghost`** — 배경 없는 미니 버튼. `{colors.muted}` 텍스트. LegCard 내 편집(✏️)/삭제(🗑️) 액션.

**`button-icon`** — 36×36px 사각 아이콘 버튼. `{rounded.md}` (8px), hairline 테두리. 닫기, 뒤로가기 등.

### App Header

**`app-header`** — 높이 56px, 흰 배경, 하단 1px hairline. 좌측: "Travel Map" 타이틀 in `{typography.label-md}`. 우측: "Import" `{component.button-secondary}`, "Export" `{component.button-secondary}`, "+ 여행" `{component.button-primary}`. 네비게이션은 없다.

### Sidebar Components

**`trip-sidebar`** — 280px 고정폭, 흰 배경, 우측 1px hairline. 내부: TripList (상단) → TransportFilter (하단) → "+ Leg" 버튼 (최하단 고정). `overflow-y: auto`.

**`leg-card`** — 사이드바 내 각 Leg를 표시하는 카드. 흰 배경, `{rounded.md}`, hairline 테두리, 내부 padding `{spacing.sm}` (12px). 좌측 3px solid border = 교통수단 색상. 콘텐츠: 교통수단 이모지 + "출발 → 도착" in `{typography.body-md}`, 날짜 in `{typography.body-sm}` `{colors.muted}`, 우측 편집/삭제 ghost 버튼.
- Active 상태: `{component.leg-card-active}` — `{colors.surface-soft}` 배경 + `{colors.border-strong}` 테두리.

**`leg-form`** — Leg 추가/편집 패널. 흰 배경, `{rounded.lg}`, hairline 테두리, padding 20px. 지도 위 overlay 또는 사이드바 inline. 필드: 출발 도시 (CitySearch), 도착 도시 (CitySearch), 교통수단 선택 (6개 transport 칩), 출발 일시, 도착 일시, 메모(optional). 하단: "저장" `{component.button-primary}` + "취소" `{component.button-secondary}`.

**`text-input`** — 높이 40px, `{rounded.sm}` (6px), padding 10px × 12px, hairline 테두리. 포커스 시 `{component.text-input-focus}` — 테두리가 `{colors.link}`로 변경. 항상 `<label>` 연결.

**`transport-filter-chip`** — 교통수단 6개를 pill 형태로 표시. 기본: `{colors.surface-soft}` 배경 + hairline 테두리. 활성: 배경이 해당 `transport-*` 색상, 텍스트 `{colors.on-primary}`. `{rounded.pill}`.

**`transport-badge`** — LegCard 내 인라인 교통수단 레이블. 해당 `transport-*` 색상 배경, `{colors.on-primary}` 텍스트, `{typography.transport-badge}`, `{rounded.pill}`. 10자 이하 (예: "항공", "기차").

**`empty-state`** — Trip이 없거나 필터 결과가 없을 때. `{colors.surface-soft}` 배경, `{rounded.lg}`, padding 48px 24px. 아이콘(지도 핀 아웃라인) + `{typography.title-md}` 문구 + `{component.button-primary}`. 문구: "아직 기록된 여행이 없어요. 첫 여행을 추가해보세요."

### Map Components

**`map-container`** — Leaflet 지도가 채우는 영역. 별도 UI 스타일 없음 — OpenStreetMap 타일이 표면 역할을 한다. 마커와 폴리라인이 유일한 브랜드 그래픽 레이어. z-index 관리: 지도 컨트롤(Leaflet 기본) < 마커 팝업 < LegForm overlay.

**City Marker** — `{rounded.full}` 원 12px + 흰 테두리 2px + 해당 교통수단 색상 채움. 선택 시 16px. 팝업: `{rounded.md}` 흰 카드 + `{typography.label-md}` 도시명 + `{typography.body-sm}` 국가 + 날짜.

**Transport Polyline** — `stroke-width: 2px`. 항공·선박은 `stroke-dasharray` 적용. 비활성(필터 해제) 시 `opacity: 0.15`.

### Landing Page Components

**`hero-band`** — 흰 캔버스. padding `{spacing.section}` (80px). 배경 장식 없음 — 지도 배경 이미지 또는 단순 그라데이션 힌트도 사용하지 않는다. 콘텐츠: `{typography.display-xl}` h1 "내 여행, 지도 위에 그리다" + `{typography.body-md}` sub + `{component.button-primary}` "지금 시작하기" + `{component.button-secondary}` "미리보기".

**`feature-card`** — 3열 grid. `{colors.surface-soft}` 배경, `{rounded.lg}`, padding `{spacing.xl}` (32px). 아이콘(24px) + `{typography.title-md}` 제목 + `{typography.body-md}` 설명.

**`signature-sky-card`** — 전폭 `{colors.signature-sky}` (#1e3a5f) 카드. `{rounded.lg}`, padding `{spacing.xxl}` (48px). 흰 텍스트. h2 in `{typography.display-md}` + 서브카피 + `{component.button-secondary}` (흰 버튼은 다크 서피스 위에서도 canvas 색상 유지).

**`signature-terrain-card`** — `{colors.signature-terrain}` (#14532d). 동일한 스펙.

**`cta-band`** — `{colors.surface-strong}` 연회색 배경, `{rounded.lg}`, padding `{spacing.xxl}`. h2 + `{component.button-primary}`.

---

## Do's and Don'ts

### Do
- `{colors.primary}` (near-black)을 Primary CTA로 사용한다. `{colors.transport-plane}` (파란색)을 버튼에 사용하면 "항공" 교통수단처럼 보인다.
- LegCard의 교통수단 표현은 왼쪽 accent border로만 한다. 카드 배경을 칠하면 가독성이 무너진다.
- `transport-*` 색상 토큰을 지도 경로선, LegCard 보더, TransportFilter 칩 — 세 곳에서만 사용하고 일관성을 유지한다.
- 사이드바를 조밀하게 유지한다. 지도가 최대한 많은 면적을 가져가야 한다.
- `{spacing.section}` (80px)을 랜딩 페이지 섹션 수직 리듬의 기준으로 삼는다.
- 시그니처 카드(sky, terrain) 사이에 반드시 흰 섹션을 둔다.

### Don't
- Hero에 그라데이션, aurora, 지도 이미지 배경을 넣지 않는다. 여행 앱이어도 마찬가지 — 지도는 앱 페이지에서 실제 기능으로 등장한다.
- `{colors.link}` (#2563eb)을 Primary 버튼에 사용하지 않는다. Link와 Primary는 다른 역할이다.
- Display 타입에 weight 700+을 사용하지 않는다. `{typography.display-xl}`은 600이 상한이다.
- `{rounded.pill}`을 TransportFilter 칩과 TransportBadge 외에 사용하지 않는다.
- 연속된 두 시그니처 카드를 붙이지 않는다. sky 카드 다음 바로 terrain 카드는 금지.
- 교통수단 색상을 배경색으로 대규모 사용하지 않는다 (badge나 3px border는 허용).
- hover 상태를 새로 설계하지 않는다.

---

## Responsive Behavior

### Breakpoints

| Name | Width | 주요 변경 |
|---|---|---|
| Mobile | < 768px | 사이드바가 하단 sheet로 전환; 지도가 전체 화면; AppHeader 타이틀만 표시; 버튼 크기 최소 44px |
| Tablet | 768–1024px | 사이드바 220px로 좁힘; feature-card 2열; 시그니처 카드 padding 32px |
| Desktop | 1024–1440px | 사이드바 280px; feature-card 3열; 전체 AppHeader |
| Wide | > 1440px | 콘텐츠 max-width 1280px, 외부 여백 추가 |

### Touch Targets
- `{component.button-primary}` / `{component.button-secondary}`: 최소 44×44px (padding 포함).
- `{component.button-ghost}` (편집/삭제): 터치 영역 최소 36×36px — 시각적 크기와 별도로 padding 확장.
- `{component.text-input}`: height 40px, 모바일에서 48px로 확장.

### Mobile Sidebar Strategy
모바일에서 사이드바는 하단에서 올라오는 sheet (bottom sheet). 기본 높이 40vh, 드래그로 60vh/90vh 확장. 지도는 항상 뒤에 보인다. Sheet 핸들바: 4×32px `{colors.border-strong}` 색상 pill.

---

## Iteration Guide

1. 컴포넌트 하나씩. YAML 키를 직접 참조 (`{component.leg-card}`, `{component.transport-filter-chip}`).
2. 교통수단 색상 변경은 `{colors.transport-*}` 토큰만 수정 — 지도 경로선, LegCard border, FilterChip 세 곳에 즉시 반영된다.
3. 컴포넌트 변형(`-active`, `-focus`, `-disabled`)은 별도 YAML 키로 — 중첩 객체로 쓰지 않는다.
4. 색상·반경·타이포 값은 반드시 토큰 참조 (`{token.ref}`). Hex는 토큰 선언부에서만 한 번 나온다.
5. hover 상태 문서화 금지.
6. 지도 위 UI를 추가할 때: z-index 레이어를 먼저 결정한다 (지도 < 경로선 < 마커 < 팝업 < LegForm overlay < Toast).

## Known Gaps

- `{colors.transport-*}` 색상 접근성(WCAG AA 대비율): 흰 배경 위에서 `{colors.transport-walk}` (#6b7280)의 텍스트 대비율이 4.5:1 미만일 수 있다. TransportBadge에서 흰 텍스트 사용 시 검토 필요.
- 모바일 bottom sheet 애니메이션 timing/easing 미정의.
- LegForm의 CitySearch 자동완성 드롭다운 스타일 미정의 (위치, z-index, 최대 높이).
- Leaflet 기본 컨트롤(줌, 어트리뷰션) 스타일 오버라이드 범위 미정의.
- 다크모드 미지원 — `prefers-color-scheme` 대응 계획 없음 (MVP 범위 외).
- hover 동작 전체 미문서화.
