'use client';

import { Polyline } from 'react-leaflet';
import type { Leg } from '@/features/trips/types';
import { TRANSPORT_STYLE } from '@/lib/transport';

interface Props {
  leg: Leg;
  dimmed?: boolean;
}

export default function TransportPolyline({ leg, dimmed = false }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  return (
    <Polyline
      positions={[
        [leg.from.lat, leg.from.lng],
        [leg.to.lat, leg.to.lng],
      ]}
      pathOptions={{
        color: style.color,
        weight: 2,
        opacity: dimmed ? 0.15 : 1,
        dashArray: style.dash,
      }}
    />
  );
}
