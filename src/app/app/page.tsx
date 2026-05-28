'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import TripList from '@/features/trips/components/TripList';
import TransportFilter from '@/features/filter/components/TransportFilter';
import EmptyState from '@/features/trips/components/EmptyState';
import TripCreateDialog from '@/features/trips/components/TripCreateDialog';
import TripEditDialog from '@/features/trips/components/TripEditDialog';
import TripDeleteConfirm from '@/features/trips/components/TripDeleteConfirm';
import CategoryManagerDialog from '@/features/trips/components/CategoryManagerDialog';
import LegForm from '@/features/trips/components/LegForm';
import PlaybackClockPanel from '@/features/trips/components/PlaybackClockPanel';
import { useTravelMapStore } from '@/features/trips/store';
import type { Trip } from '@/features/trips/types';

const MapView = dynamic(() => import('@/features/map/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface-soft animate-pulse" />,
});

export default function AppPage() {
  const trips = useTravelMapStore((s) => s.trips);
  const selectedTripId = useTravelMapStore((s) => s.selectedTripId);
  const playingTripId = useTravelMapStore((s) => s.playingTripId);
  const hasTrips = trips.length > 0;
  const playingTrip = trips.find((t) => t.id === playingTripId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [deletingTrip, setDeletingTrip] = useState<Trip | undefined>(undefined);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [legFormTripId, setLegFormTripId] = useState<string | undefined>(undefined);

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        onCreateTrip={() => setCreateOpen(true)}
        onOpenCategoryManager={() => setCategoryManagerOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[280px] shrink-0 border-r border-hairline bg-canvas overflow-y-auto p-4">
          <div className="space-y-6">
            <TripList
              onEditTrip={(trip) => setEditingTrip(trip)}
              onDeleteTrip={(trip) => setDeletingTrip(trip)}
            />
            <div className="border-t border-hairline pt-4">
              <TransportFilter />
            </div>
            <button
              type="button"
              disabled={!selectedTripId}
              onClick={() => selectedTripId && setLegFormTripId(selectedTripId)}
              title={!selectedTripId ? '먼저 여행을 선택하세요' : undefined}
              className="w-full rounded-lg bg-ink px-4 py-3 text-[15px] font-medium text-white disabled:opacity-40"
            >
              + Leg 추가
            </button>
          </div>
        </aside>
        <main className="relative flex-1 overflow-hidden">
          <MapView />
          {playingTrip && <PlaybackClockPanel legs={playingTrip.legs} />}
          {!hasTrips && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-md w-full">
                <EmptyState onCreate={() => setCreateOpen(true)} />
              </div>
            </div>
          )}
        </main>
      </div>

      <TripCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <TripEditDialog trip={editingTrip} onClose={() => setEditingTrip(undefined)} />
      <TripDeleteConfirm
        trip={deletingTrip}
        onClose={() => setDeletingTrip(undefined)}
      />
      <CategoryManagerDialog
        open={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
      />
      <LegForm tripId={legFormTripId} onClose={() => setLegFormTripId(undefined)} />
    </div>
  );
}
