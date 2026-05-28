/**
 * JSON Export / Import for Travel Map.
 *
 * Schema (v1):
 *   {
 *     "schemaVersion": 1,
 *     "trips": Trip[],
 *     "categories": Category[]
 *   }
 *
 * Validation policy (data-portability spec):
 *   1. JSON syntax parse
 *   2. Required-field presence
 *   3. Value-range / enum check
 * Any failure → atomic reject, existing store untouched.
 *
 * Migration policy (temporal-model + data-portability specs):
 *   - City.timezone is optional in wire format
 *   - After validation passes, any missing City.timezone is back-filled
 *     via tz-lookup(lat, lng) before the store is replaced
 */

import type { Category, City, Leg, Transport, Trip } from '@/features/trips/types';
import { ingestCity } from '@/lib/timezone';

const SCHEMA_VERSION = 1;
const VALID_TRANSPORTS: Transport[] = ['plane', 'train', 'car', 'bus', 'ship', 'walk'];
const TRANSPORT_SET = new Set<Transport>(VALID_TRANSPORTS);

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportSnapshot {
  schemaVersion: number;
  trips: Trip[];
  categories: Category[];
}

export function buildSnapshot(trips: Trip[], categories: Category[]): ExportSnapshot {
  return { schemaVersion: SCHEMA_VERSION, trips, categories };
}

/**
 * Serialize a snapshot to a Blob suitable for download.
 * Pretty-printed for human inspection.
 */
export function serializeSnapshot(snapshot: ExportSnapshot): Blob {
  const json = JSON.stringify(snapshot, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Trigger a browser download of the snapshot.
 * Filename includes ISO date for uniqueness.
 */
export function downloadSnapshot(
  trips: Trip[],
  categories: Category[],
  filenameStem = 'travel-map'
): void {
  if (typeof window === 'undefined') return; // SSR guard
  const snapshot = buildSnapshot(trips, categories);
  const blob = serializeSnapshot(snapshot);
  const url = URL.createObjectURL(blob);
  const today = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenameStem}-${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so download completes
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Import — Validation
// ─────────────────────────────────────────────────────────────────────────────

export interface ImportResult {
  ok: boolean;
  /** Set when ok=true */
  snapshot?: { trips: Trip[]; categories: Category[] };
  /** Set when ok=false. Human-readable. */
  error?: string;
}

/**
 * Validate JSON text and return either a clean snapshot (with timezone
 * back-fills applied) or a descriptive error. Never throws.
 */
export function importFromText(text: string): ImportResult {
  // Stage 1: JSON syntax
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: `JSON 형식 오류: ${(e as Error).message}` };
  }

  // Stage 2: shape — must be object
  if (!isPlainObject(raw)) {
    return { ok: false, error: '루트는 JSON 객체여야 합니다.' };
  }

  // Optional schemaVersion: tolerate missing or 1
  const sv = raw.schemaVersion;
  if (sv !== undefined && sv !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: `지원하지 않는 schemaVersion: ${String(sv)} (지원: ${SCHEMA_VERSION})`,
    };
  }

  // Stage 2 cont: required top-level fields
  if (!Array.isArray(raw.trips)) {
    return { ok: false, error: '필드 누락: trips (배열)' };
  }
  const categoriesField = raw.categories ?? [];
  if (!Array.isArray(categoriesField)) {
    return { ok: false, error: '필드 형식 오류: categories는 배열이어야 합니다.' };
  }

  // Stage 3: validate each entity
  const categories: Category[] = [];
  for (let i = 0; i < categoriesField.length; i++) {
    const v = validateCategory(categoriesField[i], `categories[${i}]`);
    if (!v.ok) return { ok: false, error: v.error };
    categories.push(v.value);
  }

  const trips: Trip[] = [];
  for (let i = 0; i < raw.trips.length; i++) {
    const v = validateTrip(raw.trips[i], `trips[${i}]`);
    if (!v.ok) return { ok: false, error: v.error };
    trips.push(v.value);
  }

  // Stage 4 (post-validation): timezone migration via ingestCity
  const migratedTrips: Trip[] = trips.map((t) => ({
    ...t,
    legs: t.legs.map((leg) => ({
      ...leg,
      from: ingestCity(leg.from),
      to: ingestCity(leg.to),
    })),
  }));

  return { ok: true, snapshot: { trips: migratedTrips, categories } };
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-entity validators
// ─────────────────────────────────────────────────────────────────────────────

type Validated<T> = { ok: true; value: T } | { ok: false; error: string };

function validateCategory(v: unknown, path: string): Validated<Category> {
  if (!isPlainObject(v)) return fail(`${path}: 객체가 아닙니다.`);
  if (typeof v.id !== 'string' || !v.id) return fail(`${path}.id: 비어있지 않은 문자열 필요.`);
  if (typeof v.name !== 'string' || !v.name) return fail(`${path}.name: 비어있지 않은 문자열 필요.`);
  if (typeof v.color !== 'string' || !v.color) return fail(`${path}.color: 비어있지 않은 문자열 필요.`);
  return { ok: true, value: { id: v.id, name: v.name, color: v.color } };
}

function validateTrip(v: unknown, path: string): Validated<Trip> {
  if (!isPlainObject(v)) return fail(`${path}: 객체가 아닙니다.`);
  if (typeof v.id !== 'string' || !v.id) return fail(`${path}.id: 필요.`);
  if (typeof v.title !== 'string' || !v.title) return fail(`${path}.title: 필요.`);
  if (!Array.isArray(v.legs)) return fail(`${path}.legs: 배열 필요.`);

  const legs: Leg[] = [];
  for (let i = 0; i < v.legs.length; i++) {
    const lv = validateLeg(v.legs[i], `${path}.legs[${i}]`);
    if (!lv.ok) return fail(lv.error);
    legs.push(lv.value);
  }

  const trip: Trip = { id: v.id, title: v.title, legs };

  // Optional fields
  if (v.categoryId !== undefined) {
    if (typeof v.categoryId !== 'string') return fail(`${path}.categoryId: 문자열 또는 누락.`);
    trip.categoryId = v.categoryId;
  }
  if (v.tags !== undefined) {
    if (!Array.isArray(v.tags) || !v.tags.every((t: unknown) => typeof t === 'string')) {
      return fail(`${path}.tags: 문자열 배열 또는 누락.`);
    }
    trip.tags = v.tags as string[];
  }
  return { ok: true, value: trip };
}

function validateLeg(v: unknown, path: string): Validated<Leg> {
  if (!isPlainObject(v)) return fail(`${path}: 객체가 아닙니다.`);
  if (typeof v.id !== 'string' || !v.id) return fail(`${path}.id: 필요.`);
  if (typeof v.transport !== 'string' || !TRANSPORT_SET.has(v.transport as Transport)) {
    return fail(
      `${path}.transport: ${String(v.transport)} — 허용값은 ${VALID_TRANSPORTS.join(' | ')}`
    );
  }
  if (typeof v.departedAt !== 'string' || !isIso8601(v.departedAt)) {
    return fail(`${path}.departedAt: ISO 8601 문자열 필요.`);
  }
  if (typeof v.arrivedAt !== 'string' || !isIso8601(v.arrivedAt)) {
    return fail(`${path}.arrivedAt: ISO 8601 문자열 필요.`);
  }

  const fromV = validateCity(v.from, `${path}.from`);
  if (!fromV.ok) return fail(fromV.error);
  const toV = validateCity(v.to, `${path}.to`);
  if (!toV.ok) return fail(toV.error);

  const leg: Leg = {
    id: v.id,
    from: fromV.value,
    to: toV.value,
    transport: v.transport as Transport,
    departedAt: v.departedAt,
    arrivedAt: v.arrivedAt,
  };
  if (v.note !== undefined) {
    if (typeof v.note !== 'string') return fail(`${path}.note: 문자열 또는 누락.`);
    leg.note = v.note;
  }
  return { ok: true, value: leg };
}

function validateCity(v: unknown, path: string): Validated<City> {
  if (!isPlainObject(v)) return fail(`${path}: 객체가 아닙니다.`);
  if (typeof v.name !== 'string' || !v.name) return fail(`${path}.name: 필요.`);
  if (typeof v.country !== 'string') return fail(`${path}.country: 문자열 필요.`);
  if (typeof v.lat !== 'number' || v.lat < -90 || v.lat > 90) {
    return fail(`${path}.lat: -90 이상 90 이하 숫자 필요 (받음: ${String(v.lat)}).`);
  }
  if (typeof v.lng !== 'number' || v.lng < -180 || v.lng > 180) {
    return fail(`${path}.lng: -180 이상 180 이하 숫자 필요 (받음: ${String(v.lng)}).`);
  }
  const city: City = { name: v.name, country: v.country, lat: v.lat, lng: v.lng };
  if (v.timezone !== undefined) {
    if (typeof v.timezone !== 'string') return fail(`${path}.timezone: 문자열 또는 누락.`);
    city.timezone = v.timezone;
  }
  return { ok: true, value: city };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/**
 * Lightweight ISO 8601 check. Accepts "YYYY-MM-DD" and full forms.
 * Uses Date.parse as a permissive validator — anything Date accepts is OK.
 */
function isIso8601(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return false;
  return !Number.isNaN(Date.parse(s));
}
