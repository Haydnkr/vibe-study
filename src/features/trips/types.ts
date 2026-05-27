export type Transport = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'walk';

export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Leg {
  id: string;
  from: City;
  to: City;
  transport: Transport;
  departedAt: string;
  arrivedAt: string;
  note?: string;
}

export interface Trip {
  id: string;
  title: string;
  legs: Leg[];
}
