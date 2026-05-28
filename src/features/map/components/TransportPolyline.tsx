'use client';

import { Polyline } from 'react-leaflet';
import type { Leg } from '@/features/trips/types';
import { TRANSPORT_STYLE } from '@/lib/transport';

interface Props {
  leg: Leg;
  /** Color resolved from the owning Trip's Category (or NEUTRAL fallback). */
  color: string;
  /** When true, dim the line (e.g., during playback for non-active legs). */
  dimmed?: boolean;
}

/**
 * One Leg → one polyline.
 * - Color: from Trip's Category (or NEUTRAL gray fallback)
 * - dashArray + weight: from TRANSPORT_STYLE
 * - Channel separation enforced by types — TRANSPORT_STYLE has no `color` field.
 */
export default function TransportPolyline({ leg, color, dimmed = false }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  const positions: [number, number][] = [
    [leg.from.lat, leg.from.lng],
    [leg.to.lat, leg.to.lng],
  ];

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color,
        weight: style.weight + 1,
        dashArray: style.dash,
        opacity: dimmed ? 0.25 : 1,
      }}
    />
  );
}
