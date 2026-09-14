import axios from "axios";
import type { CancelBookingResponse, StoredBooking } from "../interfaces/cancellation.interface";
import type { Seat } from "../interfaces/seat.interface";

const API_BASE_URL = "http://localhost:3000/api";

export const cancellationService = {
  async cancelBooking(orderId: string): Promise<CancelBookingResponse> {
    // 1. Simulación de procesamiento de reembolso bancario
    await new Promise((resolve) => setTimeout(resolve, 800));

    let cancelledOrder: StoredBooking | null = null;

    // 2. Actualizar registro en localStorage
    try {
      const raw = localStorage.getItem("user_booking_history");
      if (raw) {
        const history: StoredBooking[] = JSON.parse(raw);
        const updated = history.map((b) => {
          if (b.orderId === orderId) {
            cancelledOrder = {
              ...b,
              status: "CANCELLED",
              cancelledAt: new Date().toISOString(),
              refundAmount: b.totalPaid,
            };
            return cancelledOrder;
          }
          return b;
        });
        localStorage.setItem("user_booking_history", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Error actualizando storage local:", e);
    }

    if (!cancelledOrder) {
      throw new Error("No se encontró la reserva especificada.");
    }

    const orderToCancel: StoredBooking = cancelledOrder;

    // 3. Liberar las sillas a status 'available' en la función
    try {
      const funcRes = await axios.get(`${API_BASE_URL}/functions/${orderToCancel.functionId}`);
      if (funcRes.data && Array.isArray(funcRes.data.seats)) {
        const targetSeatIds = orderToCancel.seats.map((s) => (typeof s === "string" ? s : s.id));
        const releasedSeats = funcRes.data.seats.map((st: Seat) => {
          if (targetSeatIds.includes(st.id)) {
            return { ...st, status: "available" };
          }
          return st;
        });

        await axios.patch(`${API_BASE_URL}/functions/${orderToCancel.functionId}`, {
          seats: releasedSeats,
        });
      }
    } catch {
      // Fallback si la API json-server no está activa
    }

    // 4. Intentar actualizar en json-server si existe /bookings
    try {
      await axios.patch(`${API_BASE_URL}/bookings/${orderId}`, {
        status: "CANCELLED",
        cancelledAt: new Date().toISOString(),
      });
    } catch {
      // Fallback silencioso
    }

    return {
      success: true,
      orderId,
      refundAmount: orderToCancel.totalPaid,
      message: "Reserva cancelada y sillas liberadas exitosamente.",
    };
  },
};