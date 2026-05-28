import type { Transport } from '@/features/trips/types';

/**
 * Transport visual style.
 *
 * NOTE: Color is intentionally NOT part of transport style.
 * Polyline color comes from the owning Trip's Category (see categorization spec).
 * Transport is distinguished only by icon + dash pattern + weight.
 */
export const TRANSPORT_STYLE: Record<
  Transport,
  { dash: string; weight: number; label: string; icon: string }
> = {
  plane: { dash: '10 6', weight: 3, label: '항공', icon: '✈️' },
  train: { dash: '14 4', weight: 3, label: '기차', icon: '🚆' },
  car: { dash: '8 4', weight: 3, label: '자동차', icon: '🚗' },
  bus: { dash: '6 6', weight: 3, label: '버스', icon: '🚌' },
  ship: { dash: '6 3', weight: 3, label: '선박', icon: '🚢' },
  walk: { dash: '2 4', weight: 2.5, label: '도보', icon: '🚶' },
};

export const TRANSPORTS: Transport[] = ['plane', 'train', 'car', 'bus', 'ship', 'walk'];

/** Fallback polyline color when Trip has no Category. */
export const NEUTRAL_COLOR = '#888888';

/**
 * Transport signature colors per DESIGN.md.
 *
 * Used in **sidebar context only** (LegCard left border, TransportFilter
 * active chip). Map polyline color comes from the owning Trip's Category —
 * see categorization spec and selectVisibleLegs().
 *
 * Splitting color routing by context:
 *   - Map (Trip-level view):    color = Category   (group identity)
 *   - Sidebar (Leg-level view): color = Transport  (mode identity per leg)
 */
export const TRANSPORT_COLORS: Record<Transport, string> = {
  plane: '#2563eb',
  train: '#16a34a',
  car: '#d97706',
  bus: '#dc2626',
  ship: '#0891b2',
  walk: '#6b7280',
};
