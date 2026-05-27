'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import Dialog from '@/components/ui/Dialog';
import TransportFilter from '@/features/filter/components/TransportFilter';
import EmptyState from '@/features/trips/components/EmptyState';
import LegForm from '@/features/trips/components/LegForm';
import TripCreateDialog from '@/features/trips/components/TripCreateDialog';
import TripList from '@/features/trips/components/TripList';
import { useTripStore } from '@/features/trips/store';
import type { Leg, Trip } from '@/features/trips/types';
import { exportTrips, importTrips } from '@/lib/storage';

const MapView = dynamic(() => import('@/features/map/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface-soft animate-pulse" />,
});

type LegFormState =
  | { open: false }
  | { open: true; tripId: string; leg?: Leg };

export default function AppPage() {
  const trips = useTripStore((s) => s.trips);
  const removeLeg = useTripStore((s) => s.removeLeg);
  const replaceTrips = useTripStore((s) => s.replaceTrips);

  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [legForm, setLegForm] = useState<LegFormState>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<{ tripId: string; leg: Leg } | null>(null);
  const [importPending, setImportPending] = useState<Trip[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const hasTrips = trips.length > 0;

  const handleAddLeg = (tripId: string) => setLegForm({ open: true, tripId });
  const handleEditLeg = (tripId: string, leg: Leg) => setLegForm({ open: true, tripId, leg });
  const handleDeleteLeg = (tripId: string, leg: Leg) => setDeleteConfirm({ tripId, leg });

  const handleExport = () => exportTrips(trips);

  const handleImportFile = async (file: File) => {
    try {
      const parsed = await importTrips(file);
      setImportPending(parsed);
      setImportError(null);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : '가져오기 실패');
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        onCreateTrip={() => setTripDialogOpen(true)}
        onExport={handleExport}
        onImportFile={handleImportFile}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[280px] shrink-0 border-r border-hairline bg-canvas overflow-y-auto p-4">
          <div className="space-y-6">
            {hasTrips ? (
              <TripList
                onAddLeg={handleAddLeg}
                onEditLeg={handleEditLeg}
                onDeleteLeg={handleDeleteLeg}
              />
            ) : (
              <p className="text-sm text-muted">아직 여행이 없어요.</p>
            )}
            <div className="border-t border-hairline pt-4">
              <TransportFilter />
            </div>
            <button
              type="button"
              onClick={() => setTripDialogOpen(true)}
              className="w-full rounded-lg bg-ink px-4 py-3 text-[15px] font-medium text-white"
            >
              + 여행 추가
            </button>
          </div>
        </aside>
        <main className="relative flex-1 overflow-hidden">
          <MapView />
          {!hasTrips && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
              <div className="pointer-events-auto max-w-md w-full">
                <EmptyState onCreateTrip={() => setTripDialogOpen(true)} />
              </div>
            </div>
          )}
        </main>
      </div>

      <TripCreateDialog
        open={tripDialogOpen}
        onClose={() => setTripDialogOpen(false)}
      />

      {legForm.open && (
        <LegForm
          open
          onClose={() => setLegForm({ open: false })}
          tripId={legForm.tripId}
          initialLeg={legForm.leg}
        />
      )}

      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Leg 삭제"
      >
        <p className="text-sm text-body">
          {deleteConfirm
            ? `${deleteConfirm.leg.from.name} → ${deleteConfirm.leg.to.name} 구간을 정말 삭제하시겠어요?`
            : ''}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteConfirm(null)}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              if (deleteConfirm) removeLeg(deleteConfirm.tripId, deleteConfirm.leg.id);
              setDeleteConfirm(null);
            }}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white"
          >
            삭제
          </button>
        </div>
      </Dialog>

      <Dialog
        open={importPending !== null}
        onClose={() => setImportPending(null)}
        title="가져오기"
      >
        <p className="text-sm text-body">
          기존 데이터를 덮어쓸까요? 현재 저장된 여행이 모두 교체됩니다.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setImportPending(null)}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              if (importPending) replaceTrips(importPending);
              setImportPending(null);
            }}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white"
          >
            덮어쓰기
          </button>
        </div>
      </Dialog>

      <Dialog
        open={importError !== null}
        onClose={() => setImportError(null)}
        title="가져오기 실패"
      >
        <p className="text-sm text-body">{importError}</p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setImportError(null)}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white"
          >
            확인
          </button>
        </div>
      </Dialog>
    </div>
  );
}
