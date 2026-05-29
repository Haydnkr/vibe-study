'use client';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
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
    <ConfirmDialog
      open={Boolean(pending)}
      label="Leg 삭제 확인"
      title="Leg를 삭제할까요?"
      confirmLabel="삭제"
      onConfirm={handleDelete}
      onClose={onClose}
    >
      <p className="mt-3 text-sm text-body">
        <strong className="text-ink">
          {leg.from.name} → {leg.to.name}
        </strong>{' '}
        구간이 삭제됩니다.
      </p>
      <p className="mt-2 text-xs text-muted">이 작업은 되돌릴 수 없습니다.</p>
    </ConfirmDialog>
  );
}
