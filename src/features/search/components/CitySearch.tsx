'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { City } from '@/features/trips/types';
import { searchCity } from '@/features/search/geocode';

interface Props {
  label: string;
  value: City | null;
  onChange: (city: City | null) => void;
}

export default function CitySearch({ label, value, onChange }: Props) {
  const inputId = useId();
  const [query, setQuery] = useState(value?.name ?? '');
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || (value && trimmed === value.name)) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const r = await searchCity(trimmed);
        setResults(r);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="block text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onChange(null);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="도시 이름을 입력하세요"
        autoComplete="off"
        className="mt-1 h-10 w-full rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink outline-none focus:border-link"
      />
      {open && (results.length > 0 || loading) && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-hairline bg-canvas shadow-lg">
          {loading && (
            <li className="px-3 py-2 text-xs text-muted">검색 중…</li>
          )}
          {!loading &&
            results.map((r, i) => (
              <li key={`${r.name}-${r.lat}-${r.lng}-${i}`}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(r);
                    setQuery(r.name);
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-soft"
                >
                  <span className="font-medium">{r.name}</span>
                  {r.country && <span className="ml-2 text-xs text-muted">{r.country}</span>}
                </button>
              </li>
            ))}
          {!loading && results.length === 0 && (
            <li className="px-3 py-2 text-xs text-muted">검색 결과 없음</li>
          )}
        </ul>
      )}
    </div>
  );
}
