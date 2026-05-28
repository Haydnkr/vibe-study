'use client';

import { useEffect, useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import { useTravelMapStore } from '@/features/trips/store';
import type { Trip } from '@/features/trips/types';

interface Props {
  trip: Trip | undefined;
  onClose: () => void;
}

export default function TripEditDialog({ trip, onClose }: Props) {
  const updateTitle = useTravelMapStore((s) => s.updateTripTitle);
  const updateTags = useTravelMapStore((s) => s.updateTripTags);
  const setCategory = useTravelMapStore((s) => s.setTripCategory);
  const categories = useTravelMapStore((s) => s.categories);

  const [title, setTitle] = useState('');
  const [tagsRaw, setTagsRaw] = useState('');
  const [categoryId, setCategoryIdLocal] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!trip) return;
    setTitle(trip.title);
    setTagsRaw((trip.tags ?? []).join(', '));
    setCategoryIdLocal(trip.categoryId);
  }, [trip]);

  if (!trip) return null;

  const trimmed = title.trim();
  const canSubmit = trimmed.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trip || !canSubmit) return;
    updateTitle(trip.id, trimmed);
    const parsedTags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    updateTags(trip.id, parsedTags);
    setCategory(trip.id, categoryId);
    onClose();
  }

  return (
    <Dialog open={Boolean(trip)} onClose={onClose} label="여행 편집">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-lg font-medium text-ink">여행 편집</h2>

        <label className="mt-4 block text-sm text-body">
          제목
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
          />
        </label>

        <label className="mt-4 block text-sm text-body">
          태그 <span className="text-muted">(쉼표로 구분)</span>
          <input
            type="text"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="예: 유럽, 2026, 휴가"
            className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
          />
        </label>

        <label className="mt-4 block text-sm text-body">
          카테고리
          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryIdLocal(e.target.value || undefined)}
            className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
          >
            <option value="">(없음)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {categoryId && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  categories.find((c) => c.id === categoryId)?.color ?? '#888888',
              }}
            />
            <span>이 색이 폴리라인에 적용됩니다</span>
          </div>
        )}

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
