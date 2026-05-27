'use client';

import { useTripStore } from '@/features/trips/store';
import type { Transport } from '@/features/trips/types';
import { TRANSPORTS, TRANSPORT_STYLE } from '@/lib/transport';

export default function TransportFilter() {
  const activeTransports = useTripStore((s) => s.activeTransports);
  const setActiveTransports = useTripStore((s) => s.setActiveTransports);

  const toggle = (t: Transport) => {
    const next = activeTransports.includes(t)
      ? activeTransports.filter((x) => x !== t)
      : [...activeTransports, t];
    setActiveTransports(next);
  };

  // 빈 배열 = 전체 표시
  const isOn = (t: Transport) =>
    activeTransports.length === 0 || activeTransports.includes(t);

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium uppercase tracking-wider text-muted">
        교통수단
      </legend>
      <div className="flex flex-wrap gap-2">
        {TRANSPORTS.map((t) => {
          const style = TRANSPORT_STYLE[t];
          const on = isOn(t);
          return (
            <button
              type="button"
              key={t}
              onClick={() => toggle(t)}
              aria-pressed={on}
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={
                on
                  ? { backgroundColor: style.color, color: '#ffffff', borderColor: style.color }
                  : { backgroundColor: '#f9fafb', color: '#9ca3af', borderColor: '#e5e7eb' }
              }
            >
              <span aria-hidden>{style.icon}</span>
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>
      {activeTransports.length > 0 && (
        <button
          type="button"
          onClick={() => setActiveTransports([])}
          className="text-xs text-muted hover:text-ink"
        >
          전체 표시로 초기화
        </button>
      )}
    </fieldset>
  );
}
