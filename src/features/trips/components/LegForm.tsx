'use client';

import { useId, useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import CitySearch from '@/features/search/components/CitySearch';
import { useTripStore } from '@/features/trips/store';
import type { City, Leg, Transport } from '@/features/trips/types';
import { TRANSPORTS, TRANSPORT_STYLE } from '@/lib/transport';

interface Props {
  open: boolean;
  onClose: () => void;
  tripId: string;
  initialLeg?: Leg;
}

function toLocalInputValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIso(local: string): string {
  if (!local) return '';
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

export default function LegForm({ open, onClose, tripId, initialLeg }: Props) {
  const departIdRaw = useId();
  const arriveIdRaw = useId();
  const noteId = useId();
  const addLeg = useTripStore((s) => s.addLeg);
  const updateLeg = useTripStore((s) => s.updateLeg);

  const [from, setFrom] = useState<City | null>(initialLeg?.from ?? null);
  const [to, setTo] = useState<City | null>(initialLeg?.to ?? null);
  const [transport, setTransport] = useState<Transport | null>(initialLeg?.transport ?? null);
  const [departedAt, setDepartedAt] = useState(toLocalInputValue(initialLeg?.departedAt ?? ''));
  const [arrivedAt, setArrivedAt] = useState(toLocalInputValue(initialLeg?.arrivedAt ?? ''));
  const [note, setNote] = useState(initialLeg?.note ?? '');

  const canSave = !!(from && to && transport && departedAt);

  const handleSave = () => {
    if (!canSave || !from || !to || !transport) return;
    const payload = {
      from,
      to,
      transport,
      departedAt: toIso(departedAt),
      arrivedAt: toIso(arrivedAt) || toIso(departedAt),
      note: note.trim() ? note.trim() : undefined,
    };
    if (initialLeg) {
      updateLeg(tripId, { ...initialLeg, ...payload });
    } else {
      addLeg(tripId, payload);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={initialLeg ? 'Leg 편집' : '새 Leg'} size="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-4"
      >
        <CitySearch label="출발 도시" value={from} onChange={setFrom} />
        <CitySearch label="도착 도시" value={to} onChange={setTo} />

        <fieldset>
          <legend className="block text-[13px] font-medium text-ink">교통수단</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TRANSPORTS.map((t) => {
              const style = TRANSPORT_STYLE[t];
              const active = transport === t;
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTransport(t)}
                  aria-pressed={active}
                  className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                  style={
                    active
                      ? { backgroundColor: style.color, color: '#ffffff', borderColor: style.color }
                      : { backgroundColor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }
                  }
                >
                  <span aria-hidden>{style.icon}</span>
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={departIdRaw} className="block text-[13px] font-medium text-ink">
              출발 일시
            </label>
            <input
              id={departIdRaw}
              type="datetime-local"
              value={departedAt}
              onChange={(e) => setDepartedAt(e.target.value)}
              className="mt-1 h-10 w-full rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-link"
            />
          </div>
          <div>
            <label htmlFor={arriveIdRaw} className="block text-[13px] font-medium text-ink">
              도착 일시 (선택)
            </label>
            <input
              id={arriveIdRaw}
              type="datetime-local"
              value={arrivedAt}
              onChange={(e) => setArrivedAt(e.target.value)}
              className="mt-1 h-10 w-full rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-link"
            />
          </div>
        </div>

        <div>
          <label htmlFor={noteId} className="block text-[13px] font-medium text-ink">
            메모 (선택)
          </label>
          <input
            id={noteId}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="기억하고 싶은 한 줄"
            className="mt-1 h-10 w-full rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-link"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] font-medium text-ink"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </form>
    </Dialog>
  );
}
