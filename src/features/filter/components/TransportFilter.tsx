'use client';

import { TRANSPORTS, TRANSPORT_STYLE } from '@/lib/transport';
import { useTravelMapStore } from '@/features/trips/store';

export default function TransportFilter() {
  const filterTransports = useTravelMapStore((s) => s.filterTransports);
  const toggle = useTravelMapStore((s) => s.toggleFilterTransport);

  const checkedCount = filterTransports.length;

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium uppercase tracking-wider text-muted">
        교통수단
      </legend>
      <div className="flex flex-wrap gap-2">
        {TRANSPORTS.map((t) => {
          const style = TRANSPORT_STYLE[t];
          const checked = filterTransports.includes(t);
          // Last remaining checked box: disable un-check
          const disabled = checked && checkedCount === 1;
          return (
            <label
              key={t}
              title={disabled ? '최소 1개 교통수단을 선택해야 합니다' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-soft px-3 py-1 text-xs text-body ${
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(t)}
                className="h-3 w-3"
              />
              <span aria-hidden>{style.icon}</span>
              <span>{style.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
