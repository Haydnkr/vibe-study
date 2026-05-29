'use client';

import type { ReactNode } from 'react';
import Dialog from './Dialog';

interface Props {
  open: boolean;
  /** Dialog aria-label */
  label: string;
  /** Heading text */
  title: string;
  /** Body content */
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** 'danger' → red confirm button, 'default' → ink */
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Shared confirmation modal: heading + body + [취소 / confirm] footer.
 * Built on Dialog so ESC/backdrop close + aria-label behave consistently.
 */
export default function ConfirmDialog({
  open,
  label,
  title,
  children,
  confirmLabel,
  cancelLabel = '취소',
  tone = 'danger',
  onConfirm,
  onClose,
}: Props) {
  const confirmClass =
    tone === 'danger'
      ? 'rounded-lg bg-red-600 px-4 py-2 text-[15px] font-medium text-white'
      : 'rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white';

  return (
    <Dialog open={open} onClose={onClose} label={label}>
      <div className="p-6">
        <h2 className="text-lg font-medium text-ink">{title}</h2>
        {children}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] text-ink"
          >
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
