'use client';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useDataPortability } from './useDataPortability';

interface Props {
  onCreateTrip: () => void;
  onOpenCategoryManager: () => void;
}

export default function AppHeader({ onCreateTrip, onOpenCategoryManager }: Props) {
  const {
    trips,
    categories,
    fileRef,
    notice,
    confirmingImport,
    handleExport,
    handleImportPick,
    handleFileChange,
    confirmImport,
    cancelImport,
  } = useDataPortability();

  return (
    <>
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
            onClick={handleImportPick}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink hover:bg-surface-soft"
            aria-label="JSON 가져오기"
          >
            Import
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink hover:bg-surface-soft"
            aria-label="JSON 내보내기"
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
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />
      </header>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-16 right-4 z-[9999] max-w-md rounded-lg px-4 py-3 text-sm shadow-lg ${
            notice.kind === 'ok' ? 'bg-ink text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notice.message}
        </div>
      )}

      {confirmingImport && (
        <ConfirmDialog
          open
          label="Import 확인"
          title="기존 데이터를 덮어쓸까요?"
          confirmLabel="덮어쓰기"
          tone="default"
          onConfirm={confirmImport}
          onClose={cancelImport}
        >
          <p className="mt-3 text-sm text-body">
            현재 store는 <strong>Trip {trips.length}개 · Category {categories.length}개</strong>
            상태입니다. Import 파일은{' '}
            <strong>
              Trip {confirmingImport.trips.length}개 · Category {confirmingImport.categories.length}개
            </strong>
            로 완전히 교체됩니다.
          </p>
          <p className="mt-2 text-xs text-muted">병합하지 않습니다. 이 작업은 되돌릴 수 없습니다.</p>
        </ConfirmDialog>
      )}
    </>
  );
}
