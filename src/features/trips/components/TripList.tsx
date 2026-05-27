'use client';

import LegCard from './LegCard';
import { useTripStore } from '@/features/trips/store';
import type { Leg, Trip } from '@/features/trips/types';

interface Props {
  onAddLeg: (tripId: string) => void;
  onEditLeg: (tripId: string, leg: Leg) => void;
  onDeleteLeg: (tripId: string, leg: Leg) => void;
}

export default function TripList({ onAddLeg, onEditLeg, onDeleteLeg }: Props) {
  const trips = useTripStore((s) => s.trips);
  const selectedTripId = useTripStore((s) => s.selectedTripId);
  const selectTrip = useTripStore((s) => s.selectTrip);
  const removeTrip = useTripStore((s) => s.removeTrip);

  if (trips.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <TripSection
          key={trip.id}
          trip={trip}
          isActive={selectedTripId === trip.id}
          onSelect={() => selectTrip(selectedTripId === trip.id ? null : trip.id)}
          onRemove={() => removeTrip(trip.id)}
          onAddLeg={() => onAddLeg(trip.id)}
          onEditLeg={(leg) => onEditLeg(trip.id, leg)}
          onDeleteLeg={(leg) => onDeleteLeg(trip.id, leg)}
        />
      ))}
    </div>
  );
}

interface SectionProps {
  trip: Trip;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onAddLeg: () => void;
  onEditLeg: (leg: Leg) => void;
  onDeleteLeg: (leg: Leg) => void;
}

function TripSection({
  trip,
  isActive,
  onSelect,
  onRemove,
  onAddLeg,
  onEditLeg,
  onDeleteLeg,
}: SectionProps) {
  return (
    <section
      className={
        isActive ? 'rounded-md bg-surface-soft p-2 -mx-2' : 'p-2 -mx-2'
      }
    >
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 text-left text-base font-medium text-ink truncate"
          aria-pressed={isActive}
        >
          {trip.title}
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${trip.title} 여행 삭제`}
          className="text-xs text-muted hover:text-ink"
        >
          🗑️
        </button>
      </header>
      {trip.legs.length === 0 ? (
        <p className="mt-2 text-[13px] text-muted">아직 구간이 없어요.</p>
      ) : (
        <div className="mt-2 space-y-1.5">
          {trip.legs.map((leg) => (
            <LegCard
              key={leg.id}
              leg={leg}
              onEdit={onEditLeg}
              onDelete={onDeleteLeg}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onAddLeg}
        className="mt-2 text-xs font-medium text-link hover:text-link-active"
      >
        + Leg 추가
      </button>
    </section>
  );
}
