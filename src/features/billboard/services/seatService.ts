import api from './apiClient';
import type { SeatMapResponse, LockSeatsPayload, LockSeatsResponse } from '../interfaces/seat.interface';

export const seatService = {
  // Obtener la distribución y estado de las sillas
  getSeatsByFunction: async (functionId: string): Promise<SeatMapResponse> => {
    const { data } = await api.get<SeatMapResponse>(`/functions/${functionId}/seats`);
    return data;
  },

  // Bloquear temporalmente las sillas seleccionadas (10 min)
  lockSeats: async (payload: LockSeatsPayload): Promise<LockSeatsResponse> => {
    const { data } = await api.post<LockSeatsResponse>('/reservations/lock-seats', payload);
    return data;
  },

  // Liberar sillas en caso de cancelación o tiempo expirado
  releaseSeats: async (reservationId: string): Promise<void> => {
    await api.delete('/reservations/release-seats', { data: { reservationId } });
  }
};