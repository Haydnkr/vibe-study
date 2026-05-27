import type { Transport } from '@/features/trips/types';

export const TRANSPORT_STYLE: Record<
  Transport,
  { color: string; dash?: string; label: string; icon: string }
> = {
  plane: { color: '#2563eb', dash: '8 4', label: '항공', icon: '✈️' },
  train: { color: '#16a34a', label: '기차', icon: '🚆' },
  car: { color: '#d97706', label: '자동차', icon: '🚗' },
  bus: { color: '#dc2626', label: '버스', icon: '🚌' },
  ship: { color: '#0891b2', dash: '6 3', label: '선박', icon: '🚢' },
  walk: { color: '#6b7280', dash: '3 3', label: '도보', icon: '🚶' },
};

export const TRANSPORTS: Transport[] = ['plane', 'train', 'car', 'bus', 'ship', 'walk'];
