'use client';

import { useTravelMapStore, selectTripAccentColor } from '@/features/trips/store';
import type { Trip } from '@/features/trips/types';
import LegCard from './LegCard';
import TripActionMenu from './TripActionMenu';

interface Props {
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
  onEditLeg: (tripId: string, legId: string) => void;
  onDeleteLeg: (tripId: string, legId: string) => void;
}

export default function TripList({ onEditTrip, onDeleteTrip, onEditLeg, onDeleteLeg }: Props) {
  const trips = useTravelMapStore((s) => s.trips);
  const selectedTripId = useTravelMapStore((s) => s.selectedTripId);
  const selectTrip = useTravelMapStore((s) => s.selectTrip);

  if (trips.length === 0) {
    return <p className="text-sm text-muted">여행이 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          selected={trip.id === selectedTripId}
          onSelect={() => selectTrip(trip.id)}
          onEdit={() => onEditTrip(trip)}
          onDelete={() => onDeleteTrip(trip)}
          onEditLeg={onEditLeg}
          onDeleteLeg={onDeleteLeg}
        />
      ))}
    </div>
  );
}

interface CardProps {
  trip: Trip;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditLeg: (tripId: string, legId: string) => void;
  onDeleteLeg: (tripId: string, legId: string) => void;
}

function TripCard({ trip, selected, onSelect, onEdit, onDelete, onEditLeg, onDeleteLeg }: CardProps) {
  const accentColor = useTravelMapStore((s) => selectTripAccentColor(s, trip.id));
  const playingTripId = useTravelMapStore((s) => s.playingTripId);
  const startPlayback = useTravelMapStore((s) => s.startPlayback);
  const stopPlayback = useTravelMapStore((s) => s.stopPlayback);
  const tags = trip.tags ?? [];
  const isPlaying = playingTripId === trip.id;
  const canPlay = trip.legs.length > 0;

  return (
    <section
      onClick={onSelect}
      className={`rounded-lg border bg-canvas p-3 transition-colors ${
        selected ? 'border-ink' : 'border-hairline hover:border-ink/50'
      } cursor-pointer`}
      style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium text-ink">{trip.title}</h2>
          <p className="mt-0.5 text-xs text-muted">{trip.legs.length} Leg</p>
          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-soft px-2 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={!canPlay}
            onClick={() => (isPlaying ? stopPlayback() : startPlayback(trip.id))}
            title={
              !canPlay
                ? 'Leg을 먼저 추가하세요'
                : isPlaying
                  ? '재생 중지'
                  : '여행 재생'
            }
            className="inline-flex h-7 items-center gap-1 rounded-md border border-hairline px-2 text-[11px] font-medium text-ink hover:bg-surface-soft disabled:opacity-40"
          >
            <span aria-hidden>{isPlaying ? '⏸' : '▶'}</span>
            <span>{isPlaying ? '중지' : '재생'}</span>
          </button>
          <TripActionMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {trip.legs.length > 0 && (
        <div className="mt-3 space-y-2">
          {trip.legs.map((leg) => (
            <LegCard
              key={leg.id}
              leg={leg}
              accentColor={accentColor}
              onEdit={() => onEditLeg(trip.id, leg.id)}
              onDelete={() => onDeleteLeg(trip.id, leg.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
