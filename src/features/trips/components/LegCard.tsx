'use client';

import type { Leg } from '@/features/trips/types';
import { TRANSPORT_STYLE } from '@/lib/transport';

interface Props {
  leg: Leg;
  onEdit: (leg: Leg) => void;
  onDelete: (leg: Leg) => void;
}

export default function LegCard({ leg, onEdit, onDelete }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  const date = new Date(leg.departedAt);
  const dateLabel = Number.isNaN(date.getTime())
    ? ''
    : date.toISOString().slice(0, 10);

  return (
    <article
      className="rounded-md border border-hairline bg-canvas p-3"
      style={{ borderLeft: `3px solid ${style.color}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm text-ink">
            <span aria-hidden>{style.icon}</span>
            <span className="truncate">
              {leg.from.name} → {leg.to.name}
            </span>
          </div>
          {dateLabel && <div className="mt-1 text-[13px] text-muted">{dateLabel}</div>}
          {leg.note && (
            <div className="mt-1 truncate text-[13px] text-muted" title={leg.note}>
              {leg.note}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(leg)}
            aria-label={`${leg.from.name}→${leg.to.name} Leg 편집`}
            className="rounded-md px-2 py-1 text-xs text-muted hover:text-ink"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(leg)}
            aria-label={`${leg.from.name}→${leg.to.name} Leg 삭제`}
            className="rounded-md px-2 py-1 text-xs text-muted hover:text-ink"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}
