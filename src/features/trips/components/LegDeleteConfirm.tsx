'use client';

import Dialog from '@/components/ui/Dialog';
import { useTravelMapStore } from '@/features/trips/store';

interface Props {
  /** 삭제 대상 (tripId, legId). undefined면 닫힌 상태. */
  pending: { tripId: string; legId: string } | undefined;
  onClose: () => void;
}

export default function LegDeleteConfirm({ pending, onClose }: Props) {
  const deleteLeg = useTravelMapStore((s) => s.deleteLeg);
  const trip = useTravelMapStore((s) =>
    pending ? s.trips.find((t) => t.id === pending.tripId) : undefined
  );
  const leg = trip?.legs.find((l) => l.id === pending?.legId);

  if (!pending || !leg) return null;

  function handleDelete() {
    if (!pending) return;
    deleteLeg(pending.tripId, pending.legId);
    onClose();
  }

  return (
    <Dialog open={Boolean(pending)} onClose={onClose} label="Leg 삭제 확인">
      <div className="p-6">
        <h2 className="text-lg font-medium text-ink">Leg를 삭제할까요?</h2>
        <p className="mt-3 text-sm text-body">
          <strong className="text-ink">
            {leg.from.name} → {leg.to.name}
          </strong>{' '}
          구간이 삭제됩니다.
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
