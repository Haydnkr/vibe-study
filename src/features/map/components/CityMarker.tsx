'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { TRANSPORT_STYLE } from '@/lib/transport';
import { formatLocal } from '@/lib/timezone';
import type { City } from '@/features/trips/types';
import type { VisitEntry } from '@/features/trips/store';

interface Props {
  city: City;
  visits: VisitEntry[];
}

/**
 * Single marker per (city.name, city.country).
 * Popup lists all visits in chronological order.
 *
 * Uses a custom DivIcon to avoid Leaflet's default image-URL icon issues in
 * static-export bundles.
 */
export default function CityMarker({ city, visits }: Props) {
  const icon = L.divIcon({
    className: 'travel-map-city-marker',
    html: `
      <div style="
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #ffffff;
        border: 3px solid #1f2937;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });

  // Sort visits chronologically (defensive — already sorted by selector but cheap)
  const sorted = [...visits].sort((a, b) => a.at.localeCompare(b.at));

  return (
    <Marker position={[city.lat, city.lng]} icon={icon}>
      <Popup>
        <div className="font-sans">
          <div className="font-medium text-[13px]">
            {city.name}
            {city.country && <span className="ml-1 text-[11px] text-gray-500">{city.country}</span>}
          </div>
          <ul className="mt-2 space-y-1">
            {sorted.map((v, i) => {
              const style = TRANSPORT_STYLE[v.transport];
              return (
                <li key={`${v.legId}-${v.kind}-${i}`} className="text-[12px] leading-snug">
                  <span className="mr-1" aria-hidden>{style.icon}</span>
                  <span className="text-gray-700">
                    {formatLocal(v.at, city, { withTzLabel: true })}
                  </span>
                  <span className="ml-1 text-[10px] text-gray-500">
                    ({v.kind === 'depart' ? '출발' : '도착'})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Popup>
    </Marker>
  );
}
