import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, City, Leg, Transport, Trip } from './types';
import { ingestCity } from '@/lib/timezone';
import { TRANSPORTS } from '@/lib/transport';

interface TravelMapState {
  trips: Trip[];
  categories: Category[];
  selectedTripId: string | undefined;
  filterTransports: Transport[];
  /** Set to true once persisted state has been rehydrated + post-processed. */
  hydrated: boolean;

  // Trip actions
  createTrip: (title: string) => string;
  updateTripTitle: (id: string, title: string) => void;
  updateTripTags: (id: string, tags: string[]) => void;
  setTripCategory: (id: string, categoryId: string | undefined) => void;
  reorderLegs: (tripId: string, newOrder: string[]) => void;
  deleteTrip: (id: string) => void;

  // Leg actions
  addLeg: (tripId: string, leg: Omit<Leg, 'id'>) => string;
  updateLeg: (tripId: string, legId: string, patch: Partial<Omit<Leg, 'id'>>) => void;
  deleteLeg: (tripId: string, legId: string) => void;

  // Category actions
  createCategory: (input: { name: string; color: string }) => string;
  updateCategory: (id: string, patch: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;

  // Selection
  selectTrip: (id: string | undefined) => void;

  // Filter (min 1 enforced)
  toggleFilterTransport: (t: Transport) => void;
  resetFilter: () => void;

  // Bulk (for Import)
  replaceAll: (snapshot: { trips: Trip[]; categories: Category[] }) => void;

  // Hydration
  _markHydrated: () => void;
}

function genId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Apply ingestCity to every City inside a Trip's Legs (returns new Trip). */
function backfillTripCities(trip: Trip): Trip {
  return {
    ...trip,
    legs: trip.legs.map((leg) => ({
      ...leg,
      from: ingestCity(leg.from),
      to: ingestCity(leg.to),
    })),
  };
}

const storeCreator: StateCreator<
  TravelMapState,
  [['zustand/persist', unknown]]
> = (set) => ({
      trips: [],
      categories: [],
      selectedTripId: undefined,
      filterTransports: [...TRANSPORTS],
      hydrated: false,

      createTrip: (title: string) => {
        const id = genId();
        set((s: TravelMapState) => ({
          trips: [...s.trips, { id, title: title.trim(), legs: [] }],
          selectedTripId: id,
        }));
        return id;
      },

      updateTripTitle: (id: string, title: string) =>
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) =>
            t.id === id ? { ...t, title: title.trim() } : t
          ),
        })),

      updateTripTags: (id: string, tags: string[]) =>
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) => (t.id === id ? { ...t, tags } : t)),
        })),

      setTripCategory: (id: string, categoryId: string | undefined) =>
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) => (t.id === id ? { ...t, categoryId } : t)),
        })),

      reorderLegs: (tripId: string, newOrder: string[]) =>
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) => {
            if (t.id !== tripId) return t;
            const byId = new Map<string, Leg>(t.legs.map((l: Leg) => [l.id, l]));
            const reordered: Leg[] = newOrder
              .map((legId: string) => byId.get(legId))
              .filter((l: Leg | undefined): l is Leg => Boolean(l));
            for (const leg of t.legs) {
              if (!newOrder.includes(leg.id)) reordered.push(leg);
            }
            return { ...t, legs: reordered };
          }),
        })),

      deleteTrip: (id: string) =>
        set((s: TravelMapState) => {
          const remaining = s.trips.filter((t: Trip) => t.id !== id);
          const nextSelected =
            s.selectedTripId === id ? remaining[0]?.id : s.selectedTripId;
          return { trips: remaining, selectedTripId: nextSelected };
        }),

      addLeg: (tripId: string, leg: Omit<Leg, 'id'>) => {
        const id = genId();
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) =>
            t.id === tripId
              ? {
                  ...t,
                  legs: [
                    ...t.legs,
                    { ...leg, id, from: ingestCity(leg.from), to: ingestCity(leg.to) },
                  ],
                }
              : t
          ),
        }));
        return id;
      },

      updateLeg: (
        tripId: string,
        legId: string,
        patch: Partial<Omit<Leg, 'id'>>
      ) =>
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  legs: t.legs.map((l: Leg) => {
                    if (l.id !== legId) return l;
                    const merged: Leg = { ...l, ...patch };
                    if (patch.from) merged.from = ingestCity(patch.from);
                    if (patch.to) merged.to = ingestCity(patch.to);
                    return merged;
                  }),
                }
          ),
        })),

      deleteLeg: (tripId: string, legId: string) =>
        set((s: TravelMapState) => ({
          trips: s.trips.map((t: Trip) =>
            t.id === tripId
              ? { ...t, legs: t.legs.filter((l: Leg) => l.id !== legId) }
              : t
          ),
        })),

      createCategory: (input: { name: string; color: string }) => {
        const id = genId();
        set((s: TravelMapState) => ({
          categories: [
            ...s.categories,
            { id, name: input.name.trim(), color: input.color },
          ],
        }));
        return id;
      },

      updateCategory: (id: string, patch: Partial<Omit<Category, 'id'>>) =>
        set((s: TravelMapState) => ({
          categories: s.categories.map((c: Category) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      deleteCategory: (id: string) =>
        set((s: TravelMapState) => ({
          categories: s.categories.filter((c: Category) => c.id !== id),
          // Cleanup: any Trip referencing this Category becomes uncategorized
          trips: s.trips.map((t: Trip) =>
            t.categoryId === id ? { ...t, categoryId: undefined } : t
          ),
        })),

      selectTrip: (id: string | undefined) => set({ selectedTripId: id }),

      toggleFilterTransport: (t: Transport) =>
        set((s: TravelMapState): Partial<TravelMapState> => {
          const isOn = s.filterTransports.includes(t);
          if (isOn) {
            if (s.filterTransports.length <= 1) return {};
            return {
              filterTransports: s.filterTransports.filter((x: Transport) => x !== t),
            };
          }
          return { filterTransports: [...s.filterTransports, t] };
        }),

      resetFilter: () => set({ filterTransports: [...TRANSPORTS] }),

      replaceAll: (snapshot: { trips: Trip[]; categories: Category[] }) =>
        set({
          trips: snapshot.trips.map(backfillTripCities),
          categories: snapshot.categories,
          selectedTripId: snapshot.trips[0]?.id,
        }),

      _markHydrated: () => set({ hydrated: true }),
});

export const useTravelMapStore = create<TravelMapState>()(
  persist(storeCreator, {
    name: 'travel-map-store',
    version: 1,
    partialize: (state: TravelMapState) => ({
      trips: state.trips,
      categories: state.categories,
      selectedTripId: state.selectedTripId,
      filterTransports: state.filterTransports,
    }),
    onRehydrateStorage: () => (state: TravelMapState | undefined, error: unknown) => {
      if (error || !state) return;
      // §2.7: backfill any missing City.timezone via ingestCity
      const next = state.trips.map(backfillTripCities);
      useTravelMapStore.setState({ trips: next, hydrated: true });
    },
  })
);

/** Selector helpers — pure functions over store state. */

export function selectTripById(state: TravelMapState, id: string | undefined): Trip | undefined {
  if (!id) return undefined;
  return state.trips.find((t) => t.id === id);
}

export function selectCategoryById(
  state: TravelMapState,
  id: string | undefined
): Category | undefined {
  if (!id) return undefined;
  return state.categories.find((c) => c.id === id);
}

/** Resolve the accent color for a Trip via its Category, or neutral fallback. */
export function selectTripAccentColor(state: TravelMapState, tripId: string): string {
  const trip = selectTripById(state, tripId);
  if (!trip?.categoryId) return '#888888';
  const cat = selectCategoryById(state, trip.categoryId);
  return cat?.color ?? '#888888';
}

/** Aggregate visits per (name, country) across all Trips. Used by map markers. */
export interface VisitEntry {
  tripId: string;
  legId: string;
  transport: Transport;
  /** UTC ISO. Display site converts via city tz. */
  at: string;
  /** Whether this entry represents arrival ('to') or departure ('from'). */
  kind: 'arrive' | 'depart';
}

export function selectCityVisits(
  trips: Trip[],
  filter?: Transport[]
): Map<string, { city: City; visits: VisitEntry[] }> {
  const out = new Map<string, { city: City; visits: VisitEntry[] }>();
  const key = (c: City) => `${c.name} ${c.country}`;
  const allow = filter ? new Set(filter) : null;
  for (const trip of trips) {
    for (const leg of trip.legs) {
      if (allow && !allow.has(leg.transport)) continue;
      for (const role of ['from', 'to'] as const) {
        const city = leg[role];
        const k = key(city);
        const existing = out.get(k);
        const entry: VisitEntry = {
          tripId: trip.id,
          legId: leg.id,
          transport: leg.transport,
          at: role === 'from' ? leg.departedAt : leg.arrivedAt,
          kind: role === 'from' ? 'depart' : 'arrive',
        };
        if (existing) {
          existing.visits.push(entry);
        } else {
          out.set(k, { city, visits: [entry] });
        }
      }
    }
    // Sort visits chronologically
  }
  Array.from(out.values()).forEach((v) => {
    v.visits.sort((a: VisitEntry, b: VisitEntry) => a.at.localeCompare(b.at));
  });
  return out;
}

/**
 * Flat list of currently-visible Legs with their resolved accent color.
 * Each entry carries the owning Trip's Category color (or NEUTRAL fallback),
 * so render sites don't need to look up trip/category separately.
 */
export interface VisibleLeg {
  tripId: string;
  leg: Leg;
  color: string;
}

export function selectVisibleLegs(
  trips: Trip[],
  categories: Category[],
  filter?: Transport[]
): VisibleLeg[] {
  const allow = filter ? new Set(filter) : null;
  const colorByCatId = new Map<string, string>(
    categories.map((c: Category) => [c.id, c.color])
  );
  const colorForTrip = (trip: Trip): string =>
    trip.categoryId ? colorByCatId.get(trip.categoryId) ?? '#888888' : '#888888';
  const out: VisibleLeg[] = [];
  for (const trip of trips) {
    const color = colorForTrip(trip);
    for (const leg of trip.legs) {
      if (allow && !allow.has(leg.transport)) continue;
      out.push({ tripId: trip.id, leg, color });
    }
  }
  return out;
}

/**
 * Return all (lat, lng) points belonging to a Trip's Legs, suitable for
 * fitting a map view to. Returns null if the Trip has no Legs.
 * Caller is responsible for converting to L.LatLngBounds (keeps store
 * decoupled from Leaflet).
 */
export function selectTripBoundPoints(
  trips: Trip[],
  tripId: string | undefined
): [number, number][] | null {
  if (!tripId) return null;
  const trip = trips.find((t: Trip) => t.id === tripId);
  if (!trip || trip.legs.length === 0) return null;
  const points: [number, number][] = [];
  for (const leg of trip.legs) {
    points.push([leg.from.lat, leg.from.lng]);
    points.push([leg.to.lat, leg.to.lng]);
  }
  return points.length > 0 ? points : null;
}
