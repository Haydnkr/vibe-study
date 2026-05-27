import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Leg, Transport, Trip } from './types';

interface TripStore {
  trips: Trip[];
  selectedTripId: string | null;
  activeTransports: Transport[];

  addTrip: (title: string) => string;
  updateTripTitle: (tripId: string, title: string) => void;
  removeTrip: (tripId: string) => void;
  selectTrip: (tripId: string | null) => void;

  addLeg: (tripId: string, leg: Omit<Leg, 'id'>) => void;
  updateLeg: (tripId: string, leg: Leg) => void;
  removeLeg: (tripId: string, legId: string) => void;

  setActiveTransports: (transports: Transport[]) => void;

  replaceTrips: (trips: Trip[]) => void;
}

const sortLegs = (legs: Leg[]): Leg[] =>
  [...legs].sort((a, b) => a.departedAt.localeCompare(b.departedAt));

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      trips: [],
      selectedTripId: null,
      activeTransports: [],

      addTrip: (title) => {
        const id = crypto.randomUUID();
        set((state) => ({
          trips: [...state.trips, { id, title, legs: [] }],
          selectedTripId: id,
        }));
        return id;
      },

      updateTripTitle: (tripId, title) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === tripId ? { ...t, title } : t)),
        })),

      removeTrip: (tripId) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== tripId),
          selectedTripId: state.selectedTripId === tripId ? null : state.selectedTripId,
        })),

      selectTrip: (tripId) => set({ selectedTripId: tripId }),

      addLeg: (tripId, leg) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, legs: sortLegs([...t.legs, { ...leg, id: crypto.randomUUID() }]) }
              : t,
          ),
        })),

      updateLeg: (tripId, leg) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, legs: sortLegs(t.legs.map((l) => (l.id === leg.id ? leg : l))) }
              : t,
          ),
        })),

      removeLeg: (tripId, legId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId ? { ...t, legs: t.legs.filter((l) => l.id !== legId) } : t,
          ),
        })),

      setActiveTransports: (transports) => set({ activeTransports: transports }),

      replaceTrips: (trips) => set({ trips, selectedTripId: null }),
    }),
    {
      name: 'travel-map-store',
    },
  ),
);
