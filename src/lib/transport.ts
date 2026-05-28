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
  { dash?: string; weight: number; label: string; icon: string }
> = {
  plane: { dash: '8 4', weight: 3, label: '항공', icon: '✈️' },
  train: { weight: 3, label: '기차', icon: '🚆' },
  car: { weight: 3, label: '자동차', icon: '🚗' },
  bus: { weight: 3, label: '버스', icon: '🚌' },
  ship: { dash: '6 3', weight: 3, label: '선박', icon: '🚢' },
  walk: { dash: '3 3', weight: 2, label: '도보', icon: '🚶' },
};

export const TRANSPORTS: Transport[] = ['plane', 'train', 'car', 'bus', 'ship', 'walk'];

/** Fallback polyline color when Trip has no Category. */
export const NEUTRAL_COLOR = '#888888';
