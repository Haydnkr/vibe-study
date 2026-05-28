'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Per-Trip ⋮ menu trigger. Toggle a small popover with [편집] / [삭제].
 */
export default function TripActionMenu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="여행 작업 메뉴"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-surface-soft hover:text-ink"
      >
        ⋮
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-md border border-hairline bg-canvas shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-soft"
          >
            편집
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-surface-soft"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
