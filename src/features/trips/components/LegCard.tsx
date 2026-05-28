import type { Leg } from '@/features/trips/types';
import { TRANSPORT_COLORS, TRANSPORT_STYLE } from '@/lib/transport';
import { formatLocal } from '@/lib/timezone';

interface Props {
  leg: Leg;
  /** Unused on LegCard — kept for backward compat. Sidebar uses transport color. */
  accentColor?: string;
}

export default function LegCard({ leg }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  // Sidebar leg-level identity = transport color (per DESIGN.md, hybrid policy)
  const transportColor = TRANSPORT_COLORS[leg.transport];

  return (
    <article
      className="rounded-md border border-hairline bg-canvas p-3 border-l-[3px] transition-colors hover:bg-surface-soft"
      style={{ borderLeftColor: transportColor }}
    >
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
    </article>
  );
}
