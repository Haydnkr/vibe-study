import type { Leg } from '@/features/trips/types';
import { NEUTRAL_COLOR, TRANSPORT_STYLE } from '@/lib/transport';
import { formatLocal } from '@/lib/timezone';

interface Props {
  leg: Leg;
  /** Owning Trip's Category color, if any. Falls back to neutral. */
  accentColor?: string;
}

export default function LegCard({ leg, accentColor }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  const color = accentColor ?? NEUTRAL_COLOR;

  return (
    <article
      className="rounded-md border border-hairline bg-canvas p-3 border-l-[3px]"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center gap-2 text-sm text-body">
        <span aria-hidden>{style.icon}</span>
        <span className="text-ink">
          {leg.from.name} → {leg.to.name}
        </span>
      </div>
      <div className="mt-1 text-[13px] text-muted">
        {formatLocal(leg.departedAt, leg.from, { dateOnly: true })}
      </div>
    </article>
  );
}
