'use client';

import { TRANSPORTS, TRANSPORT_COLORS, TRANSPORT_STYLE } from '@/lib/transport';
import { useTravelMapStore } from '@/features/trips/store';

export default function TransportFilter() {
  const filterTransports = useTravelMapStore((s) => s.filterTransports);
  const toggle = useTravelMapStore((s) => s.toggleFilterTransport);

  const checkedCount = filterTransports.length;

  return (
    <fieldset className="space-y-2">
      <legend className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        교통수단
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {TRANSPORTS.map((t) => {
          const style = TRANSPORT_STYLE[t];
          const color = TRANSPORT_COLORS[t];
          const checked = filterTransports.includes(t);
          const disabled = checked && checkedCount === 1;
          return (
            <label
              key={t}
              title={disabled ? '최소 1개 교통수단을 선택해야 합니다' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors border ${
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
              style={
                checked
                  ? { backgroundColor: color, borderColor: color, color: '#ffffff' }
                  : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#374151' }
              }
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(t)}
                className="sr-only"
              />
              <span aria-hidden className="text-[13px]">{style.icon}</span>
              <span>{style.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
