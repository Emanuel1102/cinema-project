import React from "react";
import { Clock, Armchair, Calendar, QrCode, Ban } from "lucide-react";
import type { StoredBooking } from "../../interfaces/cancellation.interface";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface Props {
  booking: StoredBooking;
  onOpenCancelModal: (booking: StoredBooking) => void;
}

export const BookingTicketCard: React.FC<Props> = ({ booking, onOpenCancelModal }) => {
  const isCancelled = booking.status === "CANCELLED";

  const formattedDate = new Date(booking.date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const seatLabels = booking.seats
    .map((s) => (typeof s === "string" ? s : s.id))
    .join(", ");

  return (
    <div
      className={`bg-[#111424] border rounded-2xl p-5 transition flex flex-col md:flex-row items-center justify-between gap-6 shadow-md ${
        isCancelled ? "border-rose-500/20 opacity-75" : "border-white/10 hover:border-purple-500/40"
      }`}
    >
      <div className="flex-1 space-y-3 w-full">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-mono text-xs font-black text-purple-400">
            {booking.orderId}
          </span>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="size-3 text-purple-400" />
              Función
            </span>
            <p className="font-semibold text-white">{booking.functionId}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Armchair className="size-3 text-purple-400" />
              Sillas
            </span>
            <p className={`font-semibold ${isCancelled ? "line-through text-slate-500" : "text-purple-300"}`}>
              {seatLabels}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="size-3 text-purple-400" />
              Fecha Compra
            </span>
            <p className="font-semibold text-white">{formattedDate}</p>
          </div>
        </div>

        {/* Botón de Cancelar si está activa */}
        {!isCancelled && (
          <div className="pt-2 border-t border-white/5 flex justify-end">
            <button
              type="button"
              onClick={() => onOpenCancelModal(booking)}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Ban className="size-3" />
              Cancelar reserva y solicitar reembolso
            </button>
          </div>
        )}
      </div>

      {/* QR de acceso a sala */}
      <div className="flex sm:flex-col items-center justify-center p-3 bg-[#070913] border border-white/10 rounded-xl gap-2 w-full md:w-auto shrink-0 relative overflow-hidden">
        {isCancelled ? (
          <div className="flex flex-col items-center justify-center text-rose-400/60 py-2">
            <Ban className="size-8 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-400">
              Anulado
            </span>
          </div>
        ) : (
          <>
            <QrCode className="size-8 text-white" />
            <span className="text-[10px] font-mono text-slate-400 text-center">Acceso Sala</span>
          </>
        )}
      </div>
    </div>
  );
};