import type { Seat } from "./seat.interface";

export type BookingStatus = "PAID" | "CANCELLED" | "REFUNDED";

export interface StoredBooking {
  orderId: string;
  functionId: string;
  seats: (Seat | string)[];
  totalPaid: number;
  paymentMethod: string;
  customer: {
    fullName: string;
    email: string;
  };
  date: string;
  status: BookingStatus;
  cancelledAt?: string;
  refundAmount?: number;
}

export interface CancelBookingResponse {
  success: boolean;
  orderId: string;
  refundAmount: number;
  message: string;
}