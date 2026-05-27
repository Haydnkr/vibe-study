import type { Trip } from '@/features/trips/types';
import LegCard from './LegCard';

export default function TripList({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return <p className="text-sm text-muted">여행이 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <section key={trip.id}>
          <h2 className="text-xl font-medium text-ink">{trip.title}</h2>
          <div className="mt-3 space-y-2">
            {trip.legs.map((leg) => (
              <LegCard key={leg.id} leg={leg} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
