import type { Trip } from '@/features/trips/types';

const FILE_VERSION = 1;

export function exportTrips(trips: Trip[]): void {
  const blob = new Blob([JSON.stringify({ version: FILE_VERSION, trips }, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `travel-map-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTrips(file: File): Promise<Trip[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('invalid');
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed.trips)) throw new Error('invalid');
        resolve(parsed.trips as Trip[]);
      } catch {
        reject(new Error('유효하지 않은 JSON 형식입니다.'));
      }
    };
    reader.readAsText(file);
  });
}
