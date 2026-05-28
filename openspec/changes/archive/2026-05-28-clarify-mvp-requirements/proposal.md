## Why

REQUIREMENTS.md 탐색 세션에서 모호한 지점·미정의 영역·시각 채널 충돌 등 결정 누락이 드러났다. MVP 구현 전에 결정을 capability spec으로 고정해 (a) 두 트랙(MD-driven / OpenSpec-driven) 비교 실험의 출발선을 정렬하고, (b) 구현 단계에서 즉흥 결정이 누적되지 않게 한다.

## What Changes

- (NEW) **Category 엔터티** 도입 — Trip 단위 색 분류, 사용자가 자유롭게 추가/수정/삭제
- (BREAKING) **TRANSPORT_STYLE 색상 채널 제거** — 아이콘 + dash 패턴 + 굵기만 유지. 폴리라인 색은 Category에서 결정
- (NEW) **Trip 라이프사이클** — 제목/Leg 순서/태그 수정, cascade 삭제 (Leg 함께 제거)
- (BREAKING) **City.timezone 옵셔널 필드 추가** — 없으면 진입 시 lat/lng로 자동 결정
- (NEW) **Leg 시각 정책** — 저장은 UTC ISO 8601 고정, 표시는 출발/도착지 IANA TZ로 변환, 입력은 각 도시 현지시간
- (NEW) **다중 방문 마커** — 동일 (name+country)는 마커 1개, 팝업에 방문 일시를 시간순 N개 나열
- (BREAKING) **교통수단 필터 최소 1개 강제** — UC-005 대안 흐름 "전체 해제 = 전체 표시" 폐기
- (NEW) **Import 검증 정책** — 형식 + 필수 필드 + 값 범위. 하나라도 invalid 시 원자적 거부 (기존 데이터 유지)
- 의존성 추가: `tz-lookup` (~80KB, lat/lng → IANA TZ)

## Capabilities

### New Capabilities

- `trip-management`: Trip 생성/제목 수정/태그 수정/Leg 순서 변경/cascade 삭제
- `categorization`: Category 엔터티 (이름·색) CRUD, Trip↔Category 연결, 폴리라인 색 적용 정책
- `temporal-model`: Leg 시각 UTC 저장과 도시 TZ 기반 표시·입력, City.timezone 자동 결정·마이그레이션
- `map-visualization`: 도시 마커 다중 방문 집계·팝업, 폴리라인 색(Category)·패턴(Transport) 분리
- `transport-filter`: 교통수단 체크박스 필터, 최소 1개 체크 유지 강제
- `data-portability`: JSON Export/Import, 스키마 검증(형식·필드·값), 원자적 거부, 구버전 마이그레이션

### Modified Capabilities

(none — `openspec/specs/` 비어 있음. 모든 capability가 신규 생성됨)

## Impact

**Data model**:
- `Trip`: `categoryId?: string`, `tags?: string[]` 추가 (`color` 결정 철회)
- `City`: `timezone?: string` 추가
- 신규 엔터티: `Category { id, name, color }`
- Zustand store: top-level `categories: Category[]` 배열 추가

**코드 변경 지점**:
- `src/lib/transport.ts` — color 필드 제거, dashArray·weight·icon만 유지
- `src/features/trips/store.ts` — `categories`, Trip 수정/삭제 액션, Category CRUD 액션
- `src/features/map/components/TransportPolyline.tsx` — 색 source를 Category로 변경
- `src/features/map/components/CityMarker.tsx` — 동일 도시 visit 집계 + 팝업 다중 일시
- `src/features/trips/components/LegForm.tsx` — TZ 라벨 표시, 입력값 UTC 변환
- `src/features/filter/components/TransportFilter.tsx` — 마지막 체크박스 비활성화 로직
- `src/lib/storage.ts` — 스키마 검증(zod 또는 수동), 원자적 거부, timezone 보강
- 신규: Category 관리 UI (위치는 design.md에서 결정)

**Dependencies**:
- 추가: `tz-lookup` (~80KB)
- 영향 없음: `leaflet`, `react-leaflet`, `zustand`, Nominatim

**문서**:
- `REQUIREMENTS.md`: FR-011~FR-023 신규, UC-001·UC-005·FR-009 갱신, AC-008~AC-017 신규
- `CLAUDE.md`: 색 정책 제약문 갱신, 데이터 모델 변경 반영
