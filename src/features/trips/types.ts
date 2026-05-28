export type Transport = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'walk';

export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  /** IANA timezone (e.g., "Asia/Seoul"). Optional — auto-derived from lat/lng if missing. */
  timezone?: string;
}

export interface Leg {
  id: string;
  from: City;
  to: City;
  transport: Transport;
  /** UTC ISO 8601 string (e.g., "2026-05-27T01:00:00Z"). */
  departedAt: string;
  /** UTC ISO 8601 string. */
  arrivedAt: string;
  note?: string;
}

export interface Trip {
  id: string;
  title: string;
  legs: Leg[];
  /** Optional reference to a Category by id. */
  categoryId?: string;
  /** Optional text tags for search/grouping (no visual color use). */
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  /** Hex color, e.g., "#ff0000". Used for polyline + sidebar accent. */
  color: string;
}
