import type { SeatMapResponse, LockSeatsPayload, LockSeatsResponse } from '../interfaces/seat.interface';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api';

export const seatEndpoints = {
  mapByFunction: (functionId: string) => `/functions/${encodeURIComponent(functionId)}/seats`,
  lock: '/reservations/lock-seats',
  release: '/reservations/release-seats',
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  const payload: unknown = await response.json();
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const seatService = {
  // Obtener la distribución y estado de las sillas
  getSeatsByFunction: async (functionId: string): Promise<SeatMapResponse> => {
    return request<SeatMapResponse>(seatEndpoints.mapByFunction(functionId));
  },

  // Bloquear temporalmente las sillas seleccionadas (10 min)
  lockSeats: async (payload: LockSeatsPayload): Promise<LockSeatsResponse> => {
    return request<LockSeatsResponse>(seatEndpoints.lock, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Liberar sillas en caso de cancelación o tiempo expirado
  releaseSeats: async (reservationId: string): Promise<void> => {
    await request<void>(seatEndpoints.release, {
      method: 'DELETE',
      body: JSON.stringify({ reservationId }),
    });
  }
};