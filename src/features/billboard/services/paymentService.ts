import axios from "axios";
import type { ProcessPaymentPayload, PaymentResponse } from "../interfaces/payment.interface";
import type { Seat } from "../interfaces/seat.interface";

const API_BASE_URL = "http://localhost:3000/api";

export const paymentService = {
  async processPayment(
    payload: ProcessPaymentPayload,
    sessionSeatsDetails?: Seat[]
  ): Promise<PaymentResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const transactionDate = new Date().toISOString();

      const newOrderRecord = {
        orderId: newOrderId,
        functionId: payload.functionId,
        seats: sessionSeatsDetails || payload.seats,
        totalPaid: payload.totalAmount,
        paymentMethod: payload.paymentMethod,
        customer: payload.customer,
        date: transactionDate,
        status: "APPROVED" as const,
      };

      // 1. Guardar en historial de compras de la cuenta
      try {
        const storedHistory = localStorage.getItem("user_booking_history");
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        history.unshift(newOrderRecord);
        localStorage.setItem("user_booking_history", JSON.stringify(history));
      } catch (e) {
        console.error("Error guardando orden en historial local:", e);
      }

      // 2. Registro asíncrono en json-server (opcional si el endpoint existe)
      try {
        await axios.post(`${API_BASE_URL}/bookings`, newOrderRecord);
      } catch {
        // Fallback silencioso
      }

      // 3. Actualizar estado de las sillas a 'sold' en la función
      try {
        const funcRes = await axios.get(`${API_BASE_URL}/functions/${payload.functionId}`);
        if (funcRes.data && Array.isArray(funcRes.data.seats)) {
          const updatedSeats = funcRes.data.seats.map((st: Seat) => {
            if (payload.seats.includes(st.id)) {
              return { ...st, status: "sold" };
            }
            return st;
          });

          await axios.patch(`${API_BASE_URL}/functions/${payload.functionId}`, {
            seats: updatedSeats,
          });
        }
      } catch {
        // Fallback si la función se maneja en memoria
      }

      return {
        success: true,
        orderId: newOrderId,
        transactionDate,
        status: "APPROVED",
        message: "Transacción aprobada con éxito",
      };
    } catch (error: unknown) {
      console.error("Error al procesar el pago:", error);
      throw error;
    }
  },
};