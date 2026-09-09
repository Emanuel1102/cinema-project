import type { SeatMapResponse, LockSeatsPayload, LockSeatsResponse } from '../interfaces/seat.interface';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api${path}`, {
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
  return response.json() as Promise<T>;
}

export const seatService = {
  // Obtener la distribución y estado de las sillas
  getSeatsByFunction: async (functionId: string): Promise<SeatMapResponse> => {
    return request<SeatMapResponse>(`/functions/${encodeURIComponent(functionId)}/seats`);
  },

  // Bloquear temporalmente las sillas seleccionadas (10 min)
  lockSeats: async (payload: LockSeatsPayload): Promise<LockSeatsResponse> => {
    return request<LockSeatsResponse>('/reservations/lock-seats', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Liberar sillas en caso de cancelación o tiempo expirado
  releaseSeats: async (reservationId: string): Promise<void> => {
    await request<void>('/reservations/release-seats', {
      method: 'DELETE',
      body: JSON.stringify({ reservationId }),
    });
  }
};