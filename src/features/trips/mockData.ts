import type { Trip } from './types';

export const MOCK_TRIP: Trip = {
  id: 'trip-mock-1',
  title: '2024 유럽 여행',
  legs: [
    {
      id: 'leg-1',
      from: { name: '서울', country: '대한민국', lat: 37.5665, lng: 126.978 },
      to: { name: '파리', country: '프랑스', lat: 48.8566, lng: 2.3522 },
      transport: 'plane',
      departedAt: '2024-03-15T09:00:00.000Z',
      arrivedAt: '2024-03-15T19:30:00.000Z',
    },
    {
      id: 'leg-2',
      from: { name: '파리', country: '프랑스', lat: 48.8566, lng: 2.3522 },
      to: { name: '암스테르담', country: '네덜란드', lat: 52.3676, lng: 4.9041 },
      transport: 'train',
      departedAt: '2024-03-18T08:00:00.000Z',
      arrivedAt: '2024-03-18T11:20:00.000Z',
    },
    {
      id: 'leg-3',
      from: { name: '암스테르담', country: '네덜란드', lat: 52.3676, lng: 4.9041 },
      to: { name: '바르셀로나', country: '스페인', lat: 41.3851, lng: 2.1734 },
      transport: 'bus',
      departedAt: '2024-03-21T07:00:00.000Z',
      arrivedAt: '2024-03-21T22:00:00.000Z',
    },
  ],
};
