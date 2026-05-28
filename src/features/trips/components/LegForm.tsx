'use client';

import { useEffect, useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import CitySearch from '@/features/search/components/CitySearch';
import { localToUtc, resolveTimezone, tzAbbreviation } from '@/lib/timezone';
import { TRANSPORTS, TRANSPORT_STYLE } from '@/lib/transport';
import { useTravelMapStore } from '@/features/trips/store';
import type { City, Leg, Transport } from '@/features/trips/types';

interface Props {
  tripId: string | undefined;
  legId?: string;
  onClose: () => void;
}

/**
 * LegForm — used for both create and edit.
 * - tripId required, legId optional (omit = create new)
 * - User inputs date/time as wall-clock in each city's local timezone
 * - On save, converts to UTC using city.timezone
 */
export default function LegForm({ tripId, legId, onClose }: Props) {
  const trip = useTravelMapStore((s) => s.trips.find((t) => t.id === tripId));
  const existing = trip?.legs.find((l) => l.id === legId);
  const addLeg = useTravelMapStore((s) => s.addLeg);
  const updateLeg = useTravelMapStore((s) => s.updateLeg);

  const [from, setFrom] = useState<City | undefined>(existing?.from);
  const [to, setTo] = useState<City | undefined>(existing?.to);
  const [transport, setTransport] = useState<Transport>(existing?.transport ?? 'plane');
  const [departLocal, setDepartLocal] = useState(existing ? utcToLocalInput(existing.departedAt, existing.from) : '');
  const [arriveLocal, setArriveLocal] = useState(existing ? utcToLocalInput(existing.arrivedAt, existing.to) : '');
  const [note, setNote] = useState(existing?.note ?? '');

  // Reset state when modal opens with different leg
  useEffect(() => {
    if (existing) {
      setFrom(existing.from);
      setTo(existing.to);
      setTransport(existing.transport);
      setDepartLocal(utcToLocalInput(existing.departedAt, existing.from));
      setArriveLocal(utcToLocalInput(existing.arrivedAt, existing.to));
      setNote(existing.note ?? '');
    } else if (tripId) {
      setFrom(undefined);
      setTo(undefined);
      setTransport('plane');
      setDepartLocal('');
      setArriveLocal('');
      setNote('');
    }
  }, [tripId, legId, existing]);

  if (!tripId) return null;

  const canSubmit = Boolean(from && to && departLocal && arriveLocal);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tripId || !canSubmit || !from || !to) return;
    const fromTz = resolveTimezone(from);
    const toTz = resolveTimezone(to);
    const departedAt = localToUtc(departLocal, fromTz);
    const arrivedAt = localToUtc(arriveLocal, toTz);
    const payload: Omit<Leg, 'id'> = {
      from,
      to,
      transport,
      departedAt,
      arrivedAt,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    if (existing) {
      updateLeg(tripId, existing.id, payload);
    } else {
      addLeg(tripId, payload);
    }
    onClose();
  }

  const fromTzLabel = from ? `${resolveTimezone(from)}, ${tzAbbreviation(resolveTimezone(from))}` : null;
  const toTzLabel = to ? `${resolveTimezone(to)}, ${tzAbbreviation(resolveTimezone(to))}` : null;

  return (
    <Dialog open={Boolean(tripId)} onClose={onClose} label={existing ? 'Leg 편집' : 'Leg 추가'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-lg font-medium text-ink">{existing ? 'Leg 편집' : 'Leg 추가'}</h2>

        <div className="mt-4 space-y-4">
          <CitySearch label="출발 도시" value={from} onChange={setFrom} />
          <div className="space-y-1">
            <label className="block text-sm text-body">
              출발 일시
              <input
                type="datetime-local"
                value={departLocal}
                onChange={(e) => setDepartLocal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
              />
            </label>
            {fromTzLabel && (
              <p className="text-[11px] text-muted">
                ⓘ <span className="font-medium">{fromTzLabel}</span> 현지시간으로 입력
              </p>
            )}
          </div>

          <CitySearch label="도착 도시" value={to} onChange={setTo} />
          <div className="space-y-1">
            <label className="block text-sm text-body">
              도착 일시
              <input
                type="datetime-local"
                value={arriveLocal}
                onChange={(e) => setArriveLocal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
              />
            </label>
            {toTzLabel && (
              <p className="text-[11px] text-muted">
                ⓘ <span className="font-medium">{toTzLabel}</span> 현지시간으로 입력
              </p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm text-body">교통수단</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {TRANSPORTS.map((t) => {
                const s = TRANSPORT_STYLE[t];
                const selected = transport === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTransport(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                      selected
                        ? 'border-ink bg-ink text-white'
                        : 'border-hairline bg-canvas text-ink hover:bg-surface-soft'
                    }`}
                  >
                    <span aria-hidden>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block text-sm text-body">
            메모 <span className="text-muted">(선택)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-[15px] text-ink"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-ink px-4 py-2 text-[15px] font-medium text-white disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/** Convert UTC ISO + City to local datetime-local input value (YYYY-MM-DDTHH:mm). */
function utcToLocalInput(utcISO: string, city: City): string {
  const tz = resolveTimezone(city);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(utcISO));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}
