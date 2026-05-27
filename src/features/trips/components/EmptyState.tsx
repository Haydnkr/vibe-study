'use client';

interface Props {
  onCreateTrip: () => void;
}

export default function EmptyState({ onCreateTrip }: Props) {
  return (
    <div className="rounded-lg bg-surface-soft px-6 py-12 text-center shadow-sm">
      <div className="text-3xl">🗺️</div>
      <p className="mt-4 text-xl font-medium text-ink">아직 기록된 여행이 없어요</p>
      <p className="mt-2 text-sm text-muted">첫 여행을 추가해보세요.</p>
      <button
        type="button"
        onClick={onCreateTrip}
        className="mt-6 rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white"
      >
        + 여행 추가
      </button>
    </div>
  );
}
