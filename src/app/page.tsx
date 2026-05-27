import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-12">
      <section className="py-section">
        <h1 className="text-5xl font-semibold tracking-tight leading-tight text-ink">
          내 여행, 지도 위에 그리다
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-body">
          방문한 도시와 이동 수단을 기록하면, 나만의 여행 지도가 완성됩니다.
        </p>
        <div className="mt-10 flex gap-3">
          <Link
            href="/app"
            className="inline-flex items-center rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white"
          >
            지금 시작하기 →
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center rounded-lg border border-hairline bg-canvas px-5 py-3 text-[15px] font-medium text-ink"
          >
            미리보기
          </Link>
        </div>
      </section>

      <section className="py-section border-t border-hairline">
        <h2 className="text-2xl font-medium text-ink">왜 만들었나요?</h2>
        <div className="mt-8 space-y-4 max-w-2xl text-body leading-relaxed">
          <p>도시 목록은 있는데, 어떤 순서로 갔는지 한눈에 안 보여요.</p>
          <p>항공·기차·버스를 섞어서 여행했는데 이동 경로를 정리하기 어렵고,</p>
          <p>나중에 추억을 되살리려면 메모를 일일이 뒤져야 했어요.</p>
        </div>
      </section>

      <section className="py-section border-t border-hairline">
        <h2 className="text-2xl font-medium text-ink">이렇게 해결합니다</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-lg bg-surface-soft p-8">
            <div className="text-2xl">📍</div>
            <h3 className="mt-4 text-xl font-medium text-ink">도시 기록</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              방문한 도시를 검색하면 지도에 자동으로 핀이 꽂힙니다.
            </p>
          </article>
          <article className="rounded-lg bg-surface-soft p-8">
            <div className="text-2xl">✈️</div>
            <h3 className="mt-4 text-xl font-medium text-ink">경로 시각화</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              교통수단별 색상으로 이동 경로를 연결해 보여줍니다.
            </p>
          </article>
          <article className="rounded-lg bg-surface-soft p-8">
            <div className="text-2xl">💾</div>
            <h3 className="mt-4 text-xl font-medium text-ink">데이터 보관</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              여행 기록을 JSON으로 내보내고 언제든 복원할 수 있습니다.
            </p>
          </article>
        </div>
      </section>

      <section className="my-section rounded-lg bg-signature-sky p-12 text-white">
        <h2 className="text-3xl font-medium leading-tight">
          하늘길, 철길, 바닷길 — 모두 한 지도 위에.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed opacity-90">
          교통수단마다 다른 색의 선이 도시를 잇습니다. 여행의 결이 그림이 됩니다.
        </p>
      </section>

      <section className="my-section rounded-lg bg-surface-strong p-12">
        <h2 className="text-3xl font-medium text-ink">시작할 준비가 되셨나요?</h2>
        <div className="mt-6">
          <Link
            href="/app"
            className="inline-flex items-center rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white"
          >
            지금 시작하기 →
          </Link>
        </div>
      </section>

      <footer className="border-t border-hairline py-12 text-sm text-body">
        Travel Map — Built with Next.js · Leaflet · OpenStreetMap
      </footer>
    </main>
  );
}
