'use client';

import { useRef, useState } from 'react';
import { useTravelMapStore } from '@/features/trips/store';
import { downloadSnapshot, importFromText } from '@/lib/storage';
import type { Category, Trip } from '@/features/trips/types';

type Notice = { kind: 'ok' | 'error'; message: string } | null;
type Snapshot = { trips: Trip[]; categories: Category[] };

/**
 * JSON Export/Import 상태와 동작을 캡슐화한다.
 * - Export: 즉시 다운로드 + 토스트
 * - Import: 파일 검증 → 실패 시 거부 토스트, 성공 시 덮어쓰기 확인 대기
 * AppHeader는 이 훅이 반환하는 상태/핸들러를 그리기만 한다.
 */
export function useDataPortability() {
  const trips = useTravelMapStore((s) => s.trips);
  const categories = useTravelMapStore((s) => s.categories);
  const replaceAll = useTravelMapStore((s) => s.replaceAll);

  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmingImport, setConfirmingImport] = useState<Snapshot | null>(null);

  function flash(n: Notice) {
    setNotice(n);
    if (n) setTimeout(() => setNotice(null), 4500);
  }

  function handleExport() {
    try {
      downloadSnapshot(trips, categories);
      flash({
        kind: 'ok',
        message: `Export 완료 (Trip ${trips.length}개, Category ${categories.length}개)`,
      });
    } catch (e) {
      flash({ kind: 'error', message: `Export 실패: ${(e as Error).message}` });
    }
  }

  function handleImportPick() {
    fileRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-import of same file
    if (!file) return;
    try {
      const text = await file.text();
      const result = importFromText(text);
      if (!result.ok || !result.snapshot) {
        flash({ kind: 'error', message: `Import 거부: ${result.error}` });
        return;
      }
      setConfirmingImport(result.snapshot);
    } catch (err) {
      flash({ kind: 'error', message: `파일 읽기 실패: ${(err as Error).message}` });
    }
  }

  function confirmImport() {
    if (!confirmingImport) return;
    replaceAll(confirmingImport);
    flash({
      kind: 'ok',
      message: `Import 완료 (Trip ${confirmingImport.trips.length}개, Category ${confirmingImport.categories.length}개)`,
    });
    setConfirmingImport(null);
  }

  function cancelImport() {
    setConfirmingImport(null);
  }

  return {
    trips,
    categories,
    fileRef,
    notice,
    confirmingImport,
    handleExport,
    handleImportPick,
    handleFileChange,
    confirmImport,
    cancelImport,
  };
}
