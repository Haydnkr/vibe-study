'use client';

interface Props {
  onCreateTrip: () => void;
  onOpenCategoryManager: () => void;
}

export default function AppHeader({ onCreateTrip, onOpenCategoryManager }: Props) {
  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between border-b border-hairline bg-canvas px-4">
      <h1 className="text-sm font-medium text-ink">Travel Map</h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCategoryManager}
          className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
          aria-label="카테고리 관리"
        >
          카테고리
        </button>
        <button
          type="button"
          className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink opacity-40"
          aria-label="JSON 가져오기"
          disabled
          title="§7 Import 미구현"
        >
          Import
        </button>
        <button
          type="button"
          className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink opacity-40"
          aria-label="JSON 내보내기"
          disabled
          title="§7 Export 미구현"
        >
          Export
        </button>
        <button
          type="button"
          onClick={onCreateTrip}
          className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white"
          aria-label="새 여행 추가"
        >
          + 여행
        </button>
      </div>
    </header>
  );
}
