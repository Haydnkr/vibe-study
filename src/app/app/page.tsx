import dynamic from 'next/dynamic';
import AppHeader from '@/components/layout/AppHeader';
import TripList from '@/features/trips/components/TripList';
import TransportFilter from '@/features/filter/components/TransportFilter';
import EmptyState from '@/features/trips/components/EmptyState';
import { MOCK_TRIP } from '@/features/trips/mockData';

const MapView = dynamic(() => import('@/features/map/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface-soft animate-pulse" />,
});

export default function AppPage() {
  const trips = [MOCK_TRIP];
  const hasTrips = trips.length > 0;

  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[280px] shrink-0 border-r border-hairline bg-canvas overflow-y-auto p-4">
          <div className="space-y-6">
            <TripList trips={trips} />
            <div className="border-t border-hairline pt-4">
              <TransportFilter />
            </div>
            <button
              type="button"
              className="w-full rounded-lg bg-ink px-4 py-3 text-[15px] font-medium text-white"
            >
              + Leg 추가
            </button>
          </div>
        </aside>
        <main className="relative flex-1 overflow-hidden">
          <MapView />
          {!hasTrips && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-md w-full">
                <EmptyState />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
