import { TRANSPORTS, TRANSPORT_STYLE } from '@/lib/transport';

export default function TransportFilter() {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium uppercase tracking-wider text-muted">
        교통수단
      </legend>
      <div className="flex flex-wrap gap-2">
        {TRANSPORTS.map((t) => {
          const style = TRANSPORT_STYLE[t];
          return (
            <label
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs text-body"
            >
              <input type="checkbox" defaultChecked className="h-3 w-3" />
              <span aria-hidden>{style.icon}</span>
              <span>{style.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
