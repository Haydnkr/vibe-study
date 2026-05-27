import type { Leg } from '@/features/trips/types';
import { TRANSPORT_STYLE } from '@/lib/transport';

export default function LegCard({ leg }: { leg: Leg }) {
  const style = TRANSPORT_STYLE[leg.transport];

  return (
    <article
      className="rounded-md border border-hairline bg-canvas p-3 border-l-[3px]"
      style={{ borderLeftColor: style.color }}
    >
      <div className="flex items-center gap-2 text-sm text-body">
        <span aria-hidden>{style.icon}</span>
        <span className="text-ink">
          {leg.from.name} → {leg.to.name}
        </span>
      </div>
      <div className="mt-1 text-[13px] text-muted">
        {new Date(leg.departedAt).toISOString().slice(0, 10)}
      </div>
    </article>
  );
}
