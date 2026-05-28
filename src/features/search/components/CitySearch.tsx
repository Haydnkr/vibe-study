'use client';

import { useEffect, useRef, useState } from 'react';
import { searchCities, type GeocodeResult } from '@/features/search/geocode';
import { ingestCity } from '@/lib/timezone';
import type { City } from '@/features/trips/types';

interface Props {
  label: string;
  value?: City;
  onChange: (city: City | undefined) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 300;

export default function CitySearch({ label, value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value ? `${value.name}, ${value.country}` : '');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset query if value changes externally
  useEffect(() => {
    if (value) setQuery(`${value.name}, ${value.country}`);
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q || q === (value ? `${value.name}, ${value.country}` : '')) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await searchCities(q, controller.signal);
        setResults(r);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        setError('검색 실패. 잠시 후 다시 시도하세요.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open, value]);

  function handleSelect(r: GeocodeResult) {
    const city = ingestCity({
      name: r.name,
      country: r.country,
      lat: r.lat,
      lng: r.lng,
    });
    onChange(city);
    setQuery(`${city.name}, ${city.country}`);
    setOpen(false);
  }

  function handleClear() {
    onChange(undefined);
    setQuery('');
    setResults([]);
  }

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-sm text-body">
        {label}
        <div className="relative mt-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? '도시 이름 입력...'}
            className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2 pr-8 text-[15px] text-ink outline-none focus:border-ink"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="선택 해제"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              ×
            </button>
          )}
        </div>
      </label>
      {open && (results.length > 0 || loading || error) && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-hairline bg-canvas shadow-lg">
          {loading && (
            <p className="px-3 py-2 text-xs text-muted">검색 중...</p>
          )}
          {error && <p className="px-3 py-2 text-xs text-red-600">{error}</p>}
          {!loading && !error && results.length === 0 && query.trim() && (
            <p className="px-3 py-2 text-xs text-muted">검색 결과 없음</p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lng}-${i}`}
              type="button"
              onClick={() => handleSelect(r)}
              className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-soft"
            >
              <span className="font-medium">{r.name}</span>
              <span className="ml-1 text-xs text-muted">{r.country}</span>
              <div className="truncate text-[10px] text-muted">{r.displayName}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
