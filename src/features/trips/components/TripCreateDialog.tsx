'use client';

import { useEffect, useId, useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import { useTripStore } from '@/features/trips/store';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TripCreateDialog({ open, onClose }: Props) {
  const inputId = useId();
  const [title, setTitle] = useState('');
  const addTrip = useTripStore((s) => s.addTrip);

  useEffect(() => {
    if (!open) setTitle('');
  }, [open]);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addTrip(title.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="새 여행">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <label htmlFor={inputId} className="block text-[13px] font-medium text-ink">
          여행 제목
        </label>
        <input
          id={inputId}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          placeholder="예) 2024 유럽 여행"
          className="mt-1 h-10 w-full rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-link"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </form>
    </Dialog>
  );
}
