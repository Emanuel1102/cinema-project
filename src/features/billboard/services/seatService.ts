import axios from 'axios';
import type {
  SeatMapResponse,
  LockSeatsPayload,
  LockSeatsResponse,
} from '../interfaces/seat.interface';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const seatEndpoints = {
  mapByFunction: (functionId: string) => `/functions/${encodeURIComponent(functionId)}`,
  lock: '/reservations',
  release: (id: string) => `/reservations/${id}`,
};

export const seatService = {
  // Obtener la distribución y estado de las sillas
  getSeatsByFunction: async (functionId: string): Promise<SeatMapResponse> => {
    const { data } = await api.get<SeatMapResponse>(seatEndpoints.mapByFunction(functionId));
    return data;
  },

  // Bloquear temporalmente las sillas seleccionadas (10 min)
  lockSeats: async (payload: LockSeatsPayload): Promise<LockSeatsResponse> => {
    const reservationId = `res-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await api.post(seatEndpoints.lock, {
      id: reservationId,
      functionId: payload.functionId,
      seatIds: payload.seatIds,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    return {
      reservationId,
      expiresAt,
      totalAmount: 0,
    };
  },

  // Liberar sillas en caso de cancelación o tiempo expirado
  releaseSeats: async (reservationId: string): Promise<void> => {
    await api.delete(seatEndpoints.release(reservationId));
  },
};