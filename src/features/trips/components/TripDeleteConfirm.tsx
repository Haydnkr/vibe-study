'use client';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useTravelMapStore } from '@/features/trips/store';
import type { Trip } from '@/features/trips/types';

interface Props {
  trip: Trip | undefined;
  onClose: () => void;
}

export default function TripDeleteConfirm({ trip, onClose }: Props) {
  const deleteTrip = useTravelMapStore((s) => s.deleteTrip);

  if (!trip) return null;

  const legCount = trip.legs.length;

  function handleDelete() {
    if (!trip) return;
    deleteTrip(trip.id);
    onClose();
  }

  return (
    <ConfirmDialog
      open={Boolean(trip)}
      label="여행 삭제 확인"
      title="여행을 삭제할까요?"
      confirmLabel="삭제"
      onConfirm={handleDelete}
      onClose={onClose}
    >
      <p className="mt-3 text-sm text-body">
        <strong className="text-ink">{trip.title}</strong>
        {legCount > 0 && (
          <>
            {' '}— 이 여행의 <strong className="text-ink">Leg {legCount}개</strong>도 함께
            삭제됩니다.
          </>
        )}
      </p>
      <p className="mt-2 text-xs text-muted">이 작업은 되돌릴 수 없습니다.</p>
    </ConfirmDialog>
  );
}
