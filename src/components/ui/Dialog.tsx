'use client';

import { useEffect, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** ARIA label for the dialog */
  label: string;
  children: ReactNode;
  /** Optional max-width class, e.g. "max-w-md" */
  maxWidth?: string;
}

/**
 * Minimal modal dialog primitive.
 * - ESC closes
 * - Click outside (on backdrop) closes
 * - Initial focus is delegated to inner input's `autoFocus` (preserves IME)
 */
export default function Dialog({ open, onClose, label, children, maxWidth = 'max-w-md' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className={`relative w-full ${maxWidth} rounded-xl bg-canvas shadow-xl outline-none`}
      >
        {children}
      </div>
    </div>
  );
}
