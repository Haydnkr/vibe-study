'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  selectCityVisits,
  selectTripBoundPoints,
  selectVisibleLegs,
  useTravelMapStore,
} from '@/features/trips/store';
import CityMarker from './CityMarker';
import TransportPolyline from './TransportPolyline';

const DEFAULT_CENTER: [number, number] = [37.5665, 126.978]; // Seoul
const DEFAULT_ZOOM = 3;

export default function MapView() {
  // Subscribe only to primitive slices — they are stable references from the
  // store and won't cause re-renders unless their content actually changes.
  const trips = useTravelMapStore((s) => s.trips);
  const categories = useTravelMapStore((s) => s.categories);
  const filterTransports = useTravelMapStore((s) => s.filterTransports);
  const selectedTripId = useTravelMapStore((s) => s.selectedTripId);

  // Derive visible legs + visit aggregation + bounds via store selectors.
  // useMemo deps mirror the slices the selectors actually consume.
  const visibleLegs = useMemo(
    () => selectVisibleLegs(trips, categories, filterTransports),
    [trips, categories, filterTransports]
  );

  const cityVisits = useMemo(
    () => selectCityVisits(trips, filterTransports),
    [trips, filterTransports]
  );

  const boundPoints = useMemo(
    () => selectTripBoundPoints(trips, selectedTripId),
    [trips, selectedTripId]
  );

  const bounds = useMemo<L.LatLngBoundsExpression | null>(
    () => (boundPoints ? L.latLngBounds(boundPoints) : null),
    [boundPoints]
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: '#f1f5f9' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <BoundsFitter bounds={bounds} />

      {/* Polylines first so markers sit on top */}
      {visibleLegs.map(({ tripId, leg, color }) => (
        <TransportPolyline key={`${tripId}-${leg.id}`} leg={leg} color={color} />
      ))}

      {/* One marker per unique (name + country) */}
      {Array.from(cityVisits.entries()).map(([k, { city, visits }]) => (
        <CityMarker key={k} city={city} visits={visits} />
      ))}
    </MapContainer>
  );
}

/**
 * Imperative side-effect: when bounds change, fit map to them.
 * Must live inside <MapContainer> to consume useMap().
 */
function BoundsFitter({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [bounds, map]);
  return null;
}
