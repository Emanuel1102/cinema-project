export type SeatStatus = 
  | 'available' 
  | 'selected' 
  | 'reserved' 
  | 'sold' 
  | 'disabled';

export type SeatType = 'standard' | 'preferential' | 'vip';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: SeatType;
  price: number;
}

export interface SeatMapResponse {
  functionId: string;
  movieTitle?: string;
  rows: number;
  columns: number;
  seats: Seat[];
}

export interface LockSeatsPayload {
  functionId: string;
  seatIds: string[];
}

export interface LockSeatsResponse {
  reservationId: string;
  expiresAt: string; // ISO Date String
  totalAmount: number;
}