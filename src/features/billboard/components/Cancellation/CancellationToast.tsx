import { CheckCircle2, X } from "lucide-react";

interface CancellationToastProps {
  visible: boolean;
  onClose: () => void;
  orderId?: string;
  className?: string;
}

export const CancellationToast = ({
  visible,
  onClose,
  orderId,
  className = "",
}: CancellationToastProps) => {
  return (
    <div
      aria-atomic="true"
      aria-hidden={!visible}
      aria-live="polite"
      className={`fixed inset-x-4 bottom-4 z-50 flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-[#111827]/95 p-4 text-slate-100 shadow-[0_12px_36px_rgba(15,23,42,0.55)] backdrop-blur-md transition-all duration-300 ease-out sm:inset-x-auto sm:right-6 sm:max-w-sm ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      } ${className}`}
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
        <CheckCircle2 aria-hidden="true" className="size-5" strokeWidth={2.25} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">Reembolso procesado correctamente</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">
          Tu reserva fue cancelada y el reembolso ha sido procesado.
          {orderId ? <span className="block truncate font-mono text-slate-400">Reserva: {orderId}</span> : null}
        </p>
      </div>

      <button
        type="button"
        aria-label="Cerrar confirmación de reembolso"
        onClick={onClose}
        tabIndex={visible ? 0 : -1}
        className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};

export default CancellationToast;