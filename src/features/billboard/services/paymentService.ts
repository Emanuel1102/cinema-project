import axios from "axios";
import type { ProcessPaymentPayload, PaymentResponse } from "../interfaces/payment.interface";

const API_BASE_URL = "http://localhost:3000/api";

export const paymentService = {
  /**
   * Procesa el pago de la reserva.
   * Cuando el backend esté listo, solo se ajusta el endpoint URL aquí.
   */
  async processPayment(payload: ProcessPaymentPayload): Promise<PaymentResponse> {
    try {
      // 1. MODO SIMULADO / MOCK LOCAL
      // Simula latencia de red bancaria (1.2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Intento opcional de registrar en json-server si existe la colección "bookings"
      try {
        await axios.post(`${API_BASE_URL}/bookings`, {
          id: `book-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          status: "PAID",
        });
      } catch {
        // Si no existe el endpoint en json-server, continúa sin romper la UX
        console.info("Aviso: /bookings no configurado en json-server, operando en memoria.");
      }

      return {
        success: true,
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        transactionDate: new Date().toISOString(),
        status: "APPROVED",
        message: "Transacción aprobada con éxito",
      };

      /* 
      // 2. MODO PRODUCCIÓN / ENDPOINT REAL (Descomentar al recibir la API real):
      const response = await axios.post<PaymentResponse>(`${API_BASE_URL}/v1/payments/process`, payload);
      return response.data;
      */
    } catch (error: unknown) {
      console.error("Error al procesar el pago:", error);
      throw error;
    }
  },
};