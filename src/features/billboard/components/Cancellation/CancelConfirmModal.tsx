import React, { useEffect } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import type { StoredBooking } from "../../interfaces/cancellation.interface";
import { RefundSummary } from "./RefundSummary";

interface Props {
  booking: StoredBooking;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (orderId: string) => void;
}

export const CancelConfirmModal: React.FC<Props> = ({
  booking,
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#111424] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-50"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 text-amber-400">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">¿Cancelar esta reserva?</h3>
            <span className="text-xs text-slate-400 font-mono">{booking.orderId}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Esta acción liberará inmediatamente tus sillas seleccionadas para que otros usuarios puedan comprarlas. Esta operación no se puede deshacer.
        </p>

        <RefundSummary totalPaid={booking.totalPaid} paymentMethod={booking.paymentMethod} />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-slate-300 hover:bg-white/5 transition cursor-pointer disabled:opacity-50"
          >
            Volver
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(booking.orderId)}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Confirmar Anulación"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};