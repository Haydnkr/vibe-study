'use client';

import { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import { useTravelMapStore } from '@/features/trips/store';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TripCreateDialog({ open, onClose }: Props) {
  const [title, setTitle] = useState('');
  const createTrip = useTravelMapStore((s) => s.createTrip);

  const trimmed = title.trim();
  const canSubmit = trimmed.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    createTrip(trimmed);
    setTitle('');
    onClose();
  }

  function handleClose() {
    setTitle('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} label="새 여행 만들기">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-lg font-medium text-ink">새 여행</h2>
        <label className="mt-4 block text-sm text-body">
          제목
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 2026 유럽 여행"
            className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
          />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] text-ink"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </form>
    </Dialog>
  );
}
