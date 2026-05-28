interface Props {
  onCreate: () => void;
}

export default function EmptyState({ onCreate }: Props) {
  return (
    <div className="rounded-lg bg-canvas/90 backdrop-blur border border-hairline px-8 py-12 text-center shadow-sm">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-signature-sky/10 text-2xl">
        🗺️
      </div>
      <h2 className="mt-5 text-xl font-medium tracking-[-0.01em] text-ink">
        아직 기록된 여행이 없어요
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-body">
        첫 여행을 추가하고 도시·이동수단을 적어두면 <br />
        지도 위에 자동으로 경로가 그려집니다.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-7 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#0d1218]"
      >
        <span aria-hidden>+</span> 여행 추가
      </button>
    </div>
  );
}
