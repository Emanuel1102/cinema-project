import axios from 'axios';
import type { SeatMapResponse } from '../interfaces/seat.interface';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const seatService = {
  async getSeatsByFunction(functionId: string): Promise<SeatMapResponse> {
    const { data } = await client.get<SeatMapResponse>(`/functions/${functionId}`);
    return data;
  },

  async lockSeats({ functionId, seatIds }: { functionId: string; seatIds: string[] }): Promise<{ reservationId: string }> {
    const currentFunction = await this.getSeatsByFunction(functionId);
    
    // Marcar en json-server las sillas seleccionadas como ocupadas temporalmente
    const updatedSeats = currentFunction.seats.map((seat) => {
      if (seatIds.includes(seat.id)) {
        return { ...seat, status: 'selected' as const };
      }
      return seat;
    });

    await client.patch(`/functions/${functionId}`, { seats: updatedSeats });

    return { reservationId: `res-${Date.now()}` };
  },

  async releaseSeats(): Promise<void> {
    // Mock local: no requiere rollback remoto
    return Promise.resolve();
  },
};

export default seatService;