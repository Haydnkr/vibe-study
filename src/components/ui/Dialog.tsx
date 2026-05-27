'use client';

import { useEffect } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export default function Dialog({ open, onClose, title, children, size = 'sm' }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${size === 'sm' ? 'max-w-sm' : 'max-w-lg'} rounded-lg border border-hairline bg-canvas p-5 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-medium text-ink">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
