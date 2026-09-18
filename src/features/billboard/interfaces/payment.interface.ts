import type { Seat } from "./seat.interface";

export type PaymentMethodType = "card" | "pse";

export interface CardPaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string; // MM/YY
  cvv: string;
  installments: number; // Cuotas
}

export interface PsePaymentDetails {
  bankCode: string;
  docType: "CC" | "CE" | "NIT" | "PP";
  docNumber: string;
  personType: "natural" | "juridica";
  phoneNumber: string;
}

export interface CheckoutSessionData {
  functionId: string;
  reservationId: string;
  seats: Seat[];
  totalPrice: number;
}

export interface ProcessPaymentPayload {
  reservationId: string;
  functionId: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  customer: {
    email: string;
    fullName: string;
  };
  cardDetails?: CardPaymentDetails;
  pseDetails?: PsePaymentDetails;
}

export interface PaymentResponse {
  success: boolean;
  orderId: string;
  transactionDate: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  message: string;
}