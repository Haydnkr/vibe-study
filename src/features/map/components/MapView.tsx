'use client';

import 'leaflet/dist/leaflet.css';
import { Fragment, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useTripStore } from '@/features/trips/store';
import type { Leg } from '@/features/trips/types';
import CityMarker from './CityMarker';
import TransportPolyline from './TransportPolyline';

function FitBounds({ legs }: { legs: Leg[] }) {
  const map = useMap();

  useEffect(() => {
    if (legs.length === 0) return;
    const points: L.LatLngTuple[] = legs.flatMap((l) => [
      [l.from.lat, l.from.lng],
      [l.to.lat, l.to.lng],
    ]);
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 8 });
  }, [legs, map]);

  return null;
}

export default function MapView() {
  const trips = useTripStore((s) => s.trips);
  const selectedTripId = useTripStore((s) => s.selectedTripId);
  const activeTransports = useTripStore((s) => s.activeTransports);

  const visibleTrips = selectedTripId
    ? trips.filter((t) => t.id === selectedTripId)
    : trips;
  const allLegs = visibleTrips.flatMap((t) => t.legs);

  const isTransportActive = (transport: Leg['transport']) =>
    activeTransports.length === 0 || activeTransports.includes(transport);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      worldCopyJump
      className="h-full w-full"
      style={{ minHeight: '300px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {allLegs.map((leg) => {
        const active = isTransportActive(leg.transport);
        return (
          <Fragment key={leg.id}>
            {active && <CityMarker city={leg.from} leg={leg} />}
            {active && <CityMarker city={leg.to} leg={leg} />}
            <TransportPolyline leg={leg} dimmed={!active} />
          </Fragment>
        );
      })}
      <FitBounds legs={allLegs.filter((l) => isTransportActive(l.transport))} />
    </MapContainer>
  );
}
