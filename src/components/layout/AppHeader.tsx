'use client';

import { useRef, useState } from 'react';
import { useTravelMapStore } from '@/features/trips/store';
import { downloadSnapshot, importFromText } from '@/lib/storage';

interface Props {
  onCreateTrip: () => void;
  onOpenCategoryManager: () => void;
}

type Notice = { kind: 'ok' | 'error'; message: string } | null;

export default function AppHeader({ onCreateTrip, onOpenCategoryManager }: Props) {
  const trips = useTravelMapStore((s) => s.trips);
  const categories = useTravelMapStore((s) => s.categories);
  const replaceAll = useTravelMapStore((s) => s.replaceAll);

  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmingImport, setConfirmingImport] = useState<
    { trips: ReturnType<typeof useTravelMapStore.getState>['trips']; categories: ReturnType<typeof useTravelMapStore.getState>['categories'] } | null
  >(null);

  function handleExport() {
    try {
      downloadSnapshot(trips, categories);
      flash({ kind: 'ok', message: `Export 완료 (Trip ${trips.length}개, Category ${categories.length}개)` });
    } catch (e) {
      flash({ kind: 'error', message: `Export 실패: ${(e as Error).message}` });
    }
  }

  function handleImportPick() {
    fileRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-import of same file
    if (!file) return;
    try {
      const text = await file.text();
      const result = importFromText(text);
      if (!result.ok || !result.snapshot) {
        flash({ kind: 'error', message: `Import 거부: ${result.error}` });
        return;
      }
      setConfirmingImport(result.snapshot);
    } catch (err) {
      flash({ kind: 'error', message: `파일 읽기 실패: ${(err as Error).message}` });
    }
  }

  function confirmImport() {
    if (!confirmingImport) return;
    replaceAll(confirmingImport);
    flash({
      kind: 'ok',
      message: `Import 완료 (Trip ${confirmingImport.trips.length}개, Category ${confirmingImport.categories.length}개)`,
    });
    setConfirmingImport(null);
  }

  function cancelImport() {
    setConfirmingImport(null);
  }

  function flash(n: Notice) {
    setNotice(n);
    if (n) setTimeout(() => setNotice(null), 4500);
  }

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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Import 확인"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={cancelImport}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-xl bg-canvas p-6 shadow-xl">
            <h2 className="text-lg font-medium text-ink">기존 데이터를 덮어쓸까요?</h2>
            <p className="mt-3 text-sm text-body">
              현재 store는 <strong>Trip {trips.length}개 · Category {categories.length}개</strong>
              상태입니다. Import 파일은{' '}
              <strong>
                Trip {confirmingImport.trips.length}개 · Category {confirmingImport.categories.length}개
              </strong>
              로 완전히 교체됩니다.
            </p>
            <p className="mt-2 text-xs text-muted">병합하지 않습니다. 이 작업은 되돌릴 수 없습니다.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelImport}
                className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] text-ink"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmImport}
                className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white"
              >
                덮어쓰기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
