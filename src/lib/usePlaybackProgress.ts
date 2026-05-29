import { useEffect, useRef, useState } from 'react';
import type { Leg } from '@/features/trips/types';

/** Milliseconds spent animating each leg. Shared by overlay + clock panel. */
export const LEG_DURATION_MS = 2500;

/**
 * Drives sequential playback progress across a list of legs via rAF.
 * Returns the current leg index and intra-leg progress (0..1).
 *
 * `onDone` fires once when playback completes (or immediately when there are
 * no legs) — callers use it for side effects like stopping playback. Callers
 * with no completion side effect simply omit it.
 */
export function usePlaybackProgress(
  legs: Leg[],
  onDone?: () => void,
  legDurationMs: number = LEG_DURATION_MS
): { legIdx: number; progress: number } {
  const [legIdx, setLegIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (legs.length === 0) {
      onDone?.();
      return;
    }
    let startTime: number | null = null;
    const totalMs = legs.length * legDurationMs;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      if (elapsed >= totalMs) {
        setLegIdx(legs.length - 1);
        setProgress(1);
        onDone?.();
        return;
      }
      setLegIdx(Math.floor(elapsed / legDurationMs));
      setProgress((elapsed % legDurationMs) / legDurationMs);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [legs, legDurationMs, onDone]);

  return { legIdx, progress };
}
