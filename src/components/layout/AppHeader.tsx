'use client';

import { useRef } from 'react';

interface Props {
  onCreateTrip: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
}

export default function AppHeader({ onCreateTrip, onExport, onImportFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between border-b border-hairline bg-canvas px-4">
      <h1 className="text-sm font-medium text-ink">Travel Map</h1>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
          aria-label="JSON 가져오기"
        >
          Import
        </button>
        <button
          type="button"
          onClick={onExport}
          className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
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
    </header>
  );
}
