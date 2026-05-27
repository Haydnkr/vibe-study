'use client';

import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import type { City, Leg } from '@/features/trips/types';
import { TRANSPORT_STYLE } from '@/lib/transport';

function buildIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'travel-map-marker',
    html: `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

interface Props {
  city: City;
  leg: Leg;
}

export default function CityMarker({ city, leg }: Props) {
  const style = TRANSPORT_STYLE[leg.transport];
  const icon = buildIcon(style.color);
  const date = new Date(leg.departedAt);
  const dateLabel = Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);

  return (
    <Marker position={[city.lat, city.lng]} icon={icon}>
      <Popup>
        <div className="text-sm text-ink">
          <div className="font-medium">{city.name}</div>
          {city.country && <div className="text-xs text-muted">{city.country}</div>}
          {dateLabel && <div className="mt-1 text-xs text-muted">{dateLabel}</div>}
        </div>
      </Popup>
    </Marker>
  );
}
