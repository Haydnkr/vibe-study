import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-6 md:px-12">
      {/* Hero band */}
      <section className="py-section">
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-[12px] font-medium tracking-wide text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-signature-terrain" />
          여행 기록 · 지도 시각화
        </div>
        <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05] text-ink">
          내 여행, <br className="md:hidden" />
          지도 위에 그리다.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
          도시를 검색하고, 교통수단을 고르고, 시간을 적어두면 — 한 장의 지도가 완성됩니다.
          항공·기차·버스·선박·도보, 모든 결의 이동이 한 화면 안에서 이어집니다.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#0d1218]"
          >
            지금 시작하기
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center rounded-lg border border-hairline bg-canvas px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-surface-soft"
          >
            미리보기
          </Link>
        </div>
      </section>

      {/* Why */}
      <section className="py-section border-t border-hairline">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">왜 만들었나요</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-medium tracking-[-0.01em] leading-tight text-ink max-w-2xl">
          도시 목록은 있지만, <br />
          여행의 결은 어디에도 없었습니다.
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 max-w-4xl text-body leading-relaxed">
          <p>
            <span className="block text-[12px] font-semibold tracking-wide text-muted">01</span>
            <span className="mt-2 block">방문한 도시를 어떤 순서로 갔는지 한눈에 보이지 않았어요.</span>
          </p>
          <p>
            <span className="block text-[12px] font-semibold tracking-wide text-muted">02</span>
            <span className="mt-2 block">항공·기차·버스를 섞은 이동 경로가 따로 흩어졌습니다.</span>
          </p>
          <p>
            <span className="block text-[12px] font-semibold tracking-wide text-muted">03</span>
            <span className="mt-2 block">추억을 되살리려면 메모를 매번 일일이 뒤져야 했어요.</span>
          </p>
        </div>
      </section>

      {/* Features 3-grid */}
      <section className="py-section border-t border-hairline">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">핵심 기능</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-medium tracking-[-0.01em] leading-tight text-ink">
          이렇게 해결합니다.
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="rounded-lg bg-surface-soft p-8 transition-colors hover:bg-[#f3f4f6]">
            <div className="text-3xl">📍</div>
            <h3 className="mt-5 text-xl font-medium text-ink">도시 기록</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-body">
              도시명을 입력하면 자동완성 결과에서 핀이 정확히 찍힙니다. 시간대까지 자동으로 채워집니다.
            </p>
          </article>
          <article className="rounded-lg bg-surface-soft p-8 transition-colors hover:bg-[#f3f4f6]">
            <div className="text-3xl">🛤️</div>
            <h3 className="mt-5 text-xl font-medium text-ink">경로 시각화</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-body">
              교통수단별 dash 패턴과 카테고리별 색상이 한 지도 위에서 어우러집니다.
            </p>
          </article>
          <article className="rounded-lg bg-surface-soft p-8 transition-colors hover:bg-[#f3f4f6]">
            <div className="text-3xl">💾</div>
            <h3 className="mt-5 text-xl font-medium text-ink">데이터 보관</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-body">
              JSON으로 백업하고, 다른 기기에서 그대로 복원할 수 있습니다. 검증된 스키마로 안전하게.
            </p>
          </article>
        </div>
      </section>

      {/* Signature sky band */}
      <section className="my-section overflow-hidden rounded-lg bg-signature-sky text-white p-10 md:p-14">
        <div className="max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">하늘길</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-medium leading-tight tracking-[-0.01em]">
            ICN → CDG. 10시간의 점선이<br />
            한 줄로 남습니다.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80">
            도시의 IANA 시간대로 출발·도착 시각이 표시되고, 다중 방문은 마커 하나에 시간 순으로 모입니다.
          </p>
        </div>
      </section>

      {/* Interlude white */}
      <section className="py-section border-t border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">카테고리</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.01em] leading-tight text-ink">
              여행마다 색을 부여하면 지도가 한눈에 갈래집니다.
            </h2>
          </div>
          <p className="text-body leading-relaxed pt-6">
            &ldquo;휴가&rdquo;, &ldquo;출장&rdquo;, &ldquo;탐험&rdquo; — Trip에 카테고리를 지정하면 폴리라인이 그 색으로 그려집니다.
            교통수단은 dash 패턴과 아이콘으로 따로 구분되어, 한 화면 안에 두 정보가 동시에 흐릅니다.
          </p>
        </div>
      </section>

      {/* Signature terrain band */}
      <section className="my-section overflow-hidden rounded-lg bg-signature-terrain text-white p-10 md:p-14">
        <div className="max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">육로</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-medium leading-tight tracking-[-0.01em]">
            철길과 도로, 그 사이의 작은 도시들까지.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80">
            기차로 이은 유럽, 자동차로 누빈 캘리포니아, 도보로 따라간 산티아고 — 같은 지도, 다른 결.
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="my-section rounded-lg bg-surface-strong px-10 md:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-3xl font-medium tracking-[-0.01em] leading-tight text-ink">
              시작할 준비가 되셨나요?
            </h2>
            <p className="mt-3 text-body leading-relaxed">
              계정도, 비밀번호도 필요 없습니다. 브라우저 localStorage에 자동으로 저장돼요.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex justify-self-start md:justify-self-end items-center gap-2 rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#0d1218]"
          >
            지금 시작하기
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-hairline py-12 text-[13px] text-body">
        <div className="flex flex-wrap justify-between gap-3">
          <span>Travel Map · 학습 목적 MVP</span>
          <span className="text-muted">Next.js · Leaflet · OpenStreetMap · Nominatim</span>
        </div>
      </footer>
    </main>
  );
}
