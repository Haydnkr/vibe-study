## Context

신규 프로젝트 — 단일 사용자가 브라우저만으로 여행 기록을 시각화하는 정적 웹앱. 서버·DB·로그인이 없어 모든 상태는 클라이언트에서만 유지된다. AI Coding Assistant 비교 실험(MD-driven vs OpenSpec-driven)의 OpenSpec 트랙이며, MD 트랙의 산출물(`ARCHITECTURE.md` · `TECHDESIGN.md`)과 동일한 범위를 다른 포맷으로 재표현하는 것이 목표다.

## Goals / Non-Goals

**Goals:**
- 정적 빌드(Next.js `output: 'export'`)만으로 배포 가능.
- Leg 저장 → 지도 즉시 반영(페이지 새로고침 없음).
- 새로고침 후에도 데이터 유지(localStorage persist).
- 교통수단별 색상이 지도 경로선·LegCard 보더·FilterChip 세 곳에서 일관.
- API 키 없이 외부 의존(Nominatim · OSM 타일) 가능.

**Non-Goals:**
- 서버, 데이터베이스, 인증, 다중 사용자.
- 사진/첨부 업로드, 실시간 협업, 모바일 네이티브.
- 지도 위 애니메이션 재생(별도 후속 change 에서 다룬다).
- 다국어 UI(한국어 단일).

## Decisions

### State 라이브러리: Zustand + persist 미들웨어
- **Why over Redux/Context**: 보일러플레이트 최소, persist 미들웨어가 localStorage 직렬화·역직렬화를 알아서 해 줌. 단일 store 로 충분한 규모.
- **Persist key**: `travel-map-store`. 저장 대상은 `trips`, `selectedTripId`, `activeTransports`.
- **Alternative considered**: Redux Toolkit (오버엔지니어링), React Context (persist 직접 구현 부담).

### Map 라이브러리: Leaflet + react-leaflet v4
- **Why over Mapbox/Google Maps**: 키 없이 OpenStreetMap 타일 사용 가능, 비용 0, 정적 배포에 자연스러움.
- **react-leaflet v5 제외 사유**: React 19 peer dep — 본 프로젝트는 React 18.
- **SSR 처리**: `next/dynamic({ ssr: false })` — Leaflet 은 `window` 객체를 직접 참조해 SSR 시 크래시.
- **City Marker**: `L.divIcon` 으로 직접 원형 요소를 그려 기본 marker 이미지 경로 문제(Webpack/Next 빌드 시 깨짐) 회피.

### Geocoding: Nominatim (OSM)
- **Why**: 무료, 키 불필요. MVP 단일 사용자 트래픽에 충분.
- **Debounce 300ms**: 1 req/sec 제한 준수. CitySearch 컴포넌트 내 `setTimeout` 으로 처리.
- **User-Agent 헤더**: 브라우저 fetch 는 forbidden header 라 무시됨 — 브라우저 기본 UA + Referer 로 식별. 호출 빈도(디바운스)가 실질적 보호 수단.
- **Alternative considered**: Google Geocoding (키·결제 필요), Mapbox Geocoding (키 필요).

### Import 정책: 완전 교체 (병합 X)
- **Why**: 병합 시 ID 충돌·시간 정렬 복잡도 폭증. Export 한 파일을 그대로 다시 Import 했을 때 동일 상태로 복원되는 것을 보장.
- **UX**: 호출 측에서 "기존 데이터를 덮어쓸까요?" 확인 다이얼로그 필수.

### 교통수단 색상 토큰 단일 출처
- **Why**: 색상 변경 시 지도 경로선·LegCard 보더·FilterChip 세 곳을 동시에 갱신해야 함. 인라인 hex 가 흩어지면 일관성이 무너진다.
- **Source of truth**: `src/lib/transport.ts` 의 `TRANSPORT_STYLE` 상수.

### File 구조: Feature-by-folder
- `src/features/{trips,search,map,filter}/` 각 캡슐화.
- `src/components/ui/` 와 `src/components/layout/` 는 도메인-무관 컴포넌트.
- **Why**: capability 단위 spec 과 자연스럽게 1:1 매핑. 비교 실험 시 capability ↔ 폴더 추적이 쉽다.

## Risks / Trade-offs

- **Nominatim rate limit 초과 위험** → 디바운스 300ms + 컴포넌트 unmount 시 timeout cleanup.
- **Leaflet 정적 marker 이미지 경로 깨짐** → `divIcon` 으로 우회. 기본 marker 미사용.
- **localStorage 용량 한계(약 5MB)** → MVP 단일 사용자 데이터 규모로 도달 불가. 도달 시 Export 안내.
- **브라우저 fetch 의 User-Agent 헤더 무시** → Nominatim 정책 위반은 아니지만(Referer 로 식별), 호출량 제한이 더 중요.
- **react-leaflet v4 ↔ v5 호환성** → React 19 업그레이드 시 v5 마이그레이션 필요. MVP 범위 외.
- **시간순 정렬을 store 가 책임지는 vs 컴포넌트가 책임지는** → store 에서 `addLeg`/`updateLeg` 시 정렬(현재 결정). 컴포넌트 매번 정렬은 비효율.

## Open Questions

- 같은 도시(좌표 동일)가 한 Leg 의 도착이자 다음 Leg 의 출발일 때 마커를 dedupe 할지? 현재 결정: 그대로 두 번 그림(같은 위치라 시각적 차이 없음). 사용자 피드백 후 재검토.
- 향후 다른 사람과 공유(읽기 전용 URL) 기능을 넣는다면 정적 export 만으로 가능한가? URL fragment 인코딩 검토 필요.
