'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  selectCityVisits,
  selectTripAccentColor,
  useTravelMapStore,
} from '@/features/trips/store';
import type { City, Leg, Trip } from '@/features/trips/types';
import CityMarker from './CityMarker';
import TransportPolyline from './TransportPolyline';

const KOREA_CENTER: [number, number] = [37.5665, 126.978];
const DEFAULT_ZOOM = 3;

export default function MapView() {
  const trips = useTravelMapStore((s) => s.trips);
  const categories = useTravelMapStore((s) => s.categories);
  const selectedTripId = useTravelMapStore((s) => s.selectedTripId);
  const filterTransports = useTravelMapStore((s) => s.filterTransports);

  // Resolve all legs to render, filtered by transport
  const legsByTrip = useMemo(() => {
    const out = new Map<string, Leg[]>();
    for (const trip of trips) {
      const filtered = trip.legs.filter((l) => filterTransports.includes(l.transport));
      if (filtered.length > 0) out.set(trip.id, filtered);
    }
    return out;
  }, [trips, filterTransports]);

  // Compute (name+country) -> {city, visits[]}, scoped to currently-rendered Legs
  // We rebuild from filtered legs so hidden transports don't contribute visits.
  const filteredCityVisits = useMemo(() => {
    const out = new Map<string, { city: City; visits: ReturnType<typeof selectCityVisits>['get'] extends (k: string) => infer V ? V : never }>();
    // Simpler: inline the aggregation here
    type Bucket = { city: City; visits: { tripId: string; legId: string; transport: Leg['transport']; at: string; kind: 'arrive' | 'depart' }[] };
    const buckets = new Map<string, Bucket>();
    const key = (c: City) => `${c.name} ${c.country}`;
    for (const [tripId, legs] of Array.from(legsByTrip.entries())) {
      for (const leg of legs) {
        for (const role of ['from', 'to'] as const) {
          const city = leg[role];
          const k = key(city);
          const entry = {
            tripId,
            legId: leg.id,
            transport: leg.transport,
            at: role === 'from' ? leg.departedAt : leg.arrivedAt,
            kind: (role === 'from' ? 'depart' : 'arrive') as 'arrive' | 'depart',
          };
          const b = buckets.get(k);
          if (b) b.visits.push(entry);
          else buckets.set(k, { city, visits: [entry] });
        }
      }
    }
    Array.from(buckets.values()).forEach((b) => {
      b.visits.sort((a, b2) => a.at.localeCompare(b2.at));
    });
    return buckets;
  }, [legsByTrip]);

  // For each Leg, derive its accent color via store helper (Trip → Category)
  function legAccentColor(trip: Trip): string {
    if (!trip.categoryId) return '#888888';
    return categories.find((c) => c.id === trip.categoryId)?.color ?? '#888888';
  }

  // Selected Trip's bounds for auto-fit
  const selectedBounds = useMemo<L.LatLngBoundsExpression | null>(() => {
    if (!selectedTripId) return null;
    const trip = trips.find((t) => t.id === selectedTripId);
    if (!trip || trip.legs.length === 0) return null;
    const points: [number, number][] = [];
    for (const leg of trip.legs) {
      points.push([leg.from.lat, leg.from.lng]);
      points.push([leg.to.lat, leg.to.lng]);
    }
    if (points.length === 0) return null;
    return L.latLngBounds(points);
  }, [trips, selectedTripId]);

  return (
    <MapContainer
      center={KOREA_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: '#f1f5f9' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <BoundsFitter bounds={selectedBounds} />

      {/* Polylines first so markers render on top */}
      {Array.from(legsByTrip.entries()).flatMap(([tripId, legs]) => {
        const trip = trips.find((t) => t.id === tripId);
        if (!trip) return [];
        const color = legAccentColor(trip);
        return legs.map((leg) => (
          <TransportPolyline key={`${tripId}-${leg.id}`} leg={leg} color={color} />
        ));
      })}

      {/* Markers (one per unique city) */}
      {Array.from(filteredCityVisits.entries()).map(([k, { city, visits }]) => (
        <CityMarker key={k} city={city} visits={visits} />
      ))}
    </MapContainer>
  );
}

/**
 * Imperative side-effect: when bounds change, fit map to them.
 * Must be inside <MapContainer> to access useMap().
 */
function BoundsFitter({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [bounds, map]);
  return null;
}

// Silence unused-import warning (selectTripAccentColor kept for future use)
void selectTripAccentColor;
