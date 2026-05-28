'use client';

import { useEffect, useRef, useState } from 'react';
import { formatLocal, resolveTimezone, tzAbbreviation } from '@/lib/timezone';
import { TRANSPORT_STYLE } from '@/lib/transport';
import type { Leg } from '@/features/trips/types';

interface Props {
  legs: Leg[];
  /** Milliseconds per leg — must match PlaybackOverlay. */
  legDurationMs?: number;
}

/**
 * Floating overlay (top-right of map) shown during playback.
 * Displays two clocks: departure city + arrival city, both ticking the same
 * UTC instant in each city's local timezone. Updates ~60fps.
 */
export default function PlaybackClockPanel({ legs, legDurationMs = 2500 }: Props) {
  const [legIdx, setLegIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (legs.length === 0) return;
    let startTime: number | null = null;
    const totalMs = legs.length * legDurationMs;
    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      if (elapsed >= totalMs) {
        setLegIdx(legs.length - 1);
        setProgress(1);
        return;
      }
      const idx = Math.floor(elapsed / legDurationMs);
      const within = (elapsed % legDurationMs) / legDurationMs;
      setLegIdx(idx);
      setProgress(within);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [legs, legDurationMs]);

  const leg = legs[legIdx];
  if (!leg) return null;

  // Interpolate UTC instant
  const depMs = Date.parse(leg.departedAt);
  const arrMs = Date.parse(leg.arrivedAt);
  const nowMs = depMs + (arrMs - depMs) * progress;
  const nowISO = new Date(nowMs).toISOString();

  const fromTz = resolveTimezone(leg.from);
  const toTz = resolveTimezone(leg.to);

  const fromTime = formatLocal(nowISO, leg.from, { withTzLabel: false });
  const toTime = formatLocal(nowISO, leg.to, { withTzLabel: false });
  const icon = TRANSPORT_STYLE[leg.transport].icon;

  // Strip date from formatted time for compact display
  const compact = (s: string) => s.replace(/^\d{4}\.\s*\d{2}\.\s*\d{2}\.\s*/, '').trim();
  const fromTimeOnly = compact(fromTime);
  const toTimeOnly = compact(toTime);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute top-4 right-4 z-[1000] w-[260px] rounded-xl bg-canvas/95 backdrop-blur border border-hairline p-4 shadow-xl"
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        <span>이동 중</span>
        <span>
          Leg {legIdx + 1} / {legs.length}
        </span>
      </div>

      {/* From clock */}
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[13px] font-medium text-ink">{leg.from.name}</span>
          <span className="shrink-0 text-[10px] font-medium text-muted">
            {tzAbbreviation(fromTz, new Date(nowMs))}
          </span>
        </div>
        <div className="mt-0.5 text-[28px] font-semibold tabular-nums tracking-tight text-ink leading-none">
          {fromTimeOnly}
        </div>
      </div>

      {/* Vehicle arrow */}
      <div className="my-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-hairline" />
        <span aria-hidden className="text-base">{icon}</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      {/* To clock */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[13px] font-medium text-ink">{leg.to.name}</span>
          <span className="shrink-0 text-[10px] font-medium text-muted">
            {tzAbbreviation(toTz, new Date(nowMs))}
          </span>
        </div>
        <div className="mt-0.5 text-[28px] font-semibold tabular-nums tracking-tight text-ink leading-none">
          {toTimeOnly}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-soft">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-100"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
