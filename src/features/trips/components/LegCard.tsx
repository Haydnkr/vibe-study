import type { Leg } from '@/features/trips/types';
import { TRANSPORT_COLORS, TRANSPORT_STYLE } from '@/lib/transport';
import { formatLocal } from '@/lib/timezone';

interface Props {
  leg: Leg;
  /** Unused on LegCard — kept for backward compat. Sidebar uses transport color. */
  accentColor?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function LegCard({ leg, onEdit, onDelete }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  // Sidebar leg-level identity = transport color (per DESIGN.md, hybrid policy)
  const transportColor = TRANSPORT_COLORS[leg.transport];

  return (
    <article
      className="rounded-md border border-hairline bg-canvas p-3 border-l-[3px] transition-colors hover:bg-surface-soft"
      style={{ borderLeftColor: transportColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-body">
            <span aria-hidden className="text-base">{style.icon}</span>
            <span className="text-ink font-medium">
              {leg.from.name}
              <span className="mx-1 text-muted">→</span>
              {leg.to.name}
            </span>
          </div>
          <div className="mt-1 text-[13px] text-muted tabular-nums">
            {formatLocal(leg.departedAt, leg.from, { dateOnly: true })}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                type="button"
                aria-label="Leg 편집"
                onClick={onEdit}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-surface-soft hover:text-ink"
              >
                ✎
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                aria-label="Leg 삭제"
                onClick={onDelete}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-surface-soft hover:text-red-600"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
