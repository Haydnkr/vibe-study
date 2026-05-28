'use client';

import Dialog from '@/components/ui/Dialog';
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
    <Dialog open={Boolean(trip)} onClose={onClose} label="여행 삭제 확인">
      <div className="p-6">
        <h2 className="text-lg font-medium text-ink">여행을 삭제할까요?</h2>
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
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-[15px] font-medium text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </Dialog>
  );
}
