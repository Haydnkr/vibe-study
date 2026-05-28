'use client';

import { useEffect, useRef, type ReactNode } from 'react';

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
 * - Focuses container on open
 */
export default function Dialog({ open, onClose, label, children, maxWidth = 'max-w-md' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the container
    containerRef.current?.focus();
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        ref={containerRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} rounded-xl bg-canvas shadow-xl outline-none`}
      >
        {children}
      </div>
    </div>
  );
}
