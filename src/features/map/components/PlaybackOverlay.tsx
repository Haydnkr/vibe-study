'use client';

import { useEffect } from 'react';
import { Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TRANSPORT_STYLE } from '@/lib/transport';
import { LEG_DURATION_MS, usePlaybackProgress } from '@/lib/usePlaybackProgress';
import type { Leg } from '@/features/trips/types';

interface Props {
  /** Legs to play through, in order. */
  legs: Leg[];
  /** Trip's accent color (from Category). */
  color: string;
  /** Called when playback finishes (or is cancelled). */
  onFinish: () => void;
  /** Milliseconds per leg. */
  legDurationMs?: number;
}

/**
 * Plays through a Trip's legs sequentially:
 *  - For each leg, a "vehicle" marker traces from `from` to `to`
 *  - A trail polyline grows behind the marker, drawing the route
 *  - At each leg boundary the vehicle icon swaps to the next transport
 *
 * Sibling polylines (rendered separately by MapView) stay visible as the
 * static "all routes" backdrop.
 */
export default function PlaybackOverlay({
  legs,
  color,
  onFinish,
  legDurationMs = LEG_DURATION_MS,
}: Props) {
  const map = useMap();
  const { legIdx, progress } = usePlaybackProgress(legs, onFinish, legDurationMs);

  // Zoom to fit each leg as it plays
  useEffect(() => {
    const leg = legs[legIdx];
    if (!leg) return;
    const bounds = L.latLngBounds([
      [leg.from.lat, leg.from.lng],
      [leg.to.lat, leg.to.lng],
    ]);
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6, animate: true });
  }, [legIdx, legs, map]);

  if (legs.length === 0) return null;
  const leg = legs[legIdx];
  if (!leg) return null;

  // Linear interpolation in lat/lng (good-enough for visualization)
  const lat = leg.from.lat + (leg.to.lat - leg.from.lat) * progress;
  const lng = leg.from.lng + (leg.to.lng - leg.from.lng) * progress;

  const icon = TRANSPORT_STYLE[leg.transport].icon;
  const vehicleIcon = L.divIcon({
    className: 'travel-map-vehicle',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        font-size: 18px;
        line-height: 1;
      ">${icon}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  return (
    <>
      {/* Trail polyline — grows from origin to current point */}
      <Polyline
        positions={[
          [leg.from.lat, leg.from.lng],
          [lat, lng],
        ]}
        pathOptions={{
          color,
          weight: 5,
          dashArray: TRANSPORT_STYLE[leg.transport].dash,
          opacity: 1,
        }}
      />
      {/* Vehicle marker at current point */}
      <Marker position={[lat, lng]} icon={vehicleIcon} interactive={false} />
    </>
  );
}
