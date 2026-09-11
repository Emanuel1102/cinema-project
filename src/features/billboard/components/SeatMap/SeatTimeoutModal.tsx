import React, { useEffect } from 'react';
import { TimerOff, RotateCcw, Armchair } from 'lucide-react';

interface SeatTimeoutModalProps {
  // Controla la visibilidad.  
  isOpen: boolean;
  // Limpia selección / reinicia timer. 
  onReset: () => void;
  /** Nº de sillas que se liberaron (informativo). */
  releasedSeatsCount?: number;
  className?: string;
}

export const SeatTimeoutModal: React.FC<SeatTimeoutModalProps> = ({
  isOpen,
  onReset,
  releasedSeatsCount,
  className = '',
}) => {
  // Bloquear scroll del body mientras el modal está abierto.
  // Intencionalmente NO cerramos con Escape ni con click en backdrop:
  // debe bloquear la acción hasta que el usuario acepte.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="seat-timeout-title"
      aria-describedby="seat-timeout-description"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#070913]/85 p-4 text-white backdrop-blur-sm ${className}`}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col items-center gap-3 border-b border-white/10 bg-gradient-to-r from-[#0F172A] via-[#3B0A0A] to-[#0F172A] px-6 py-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/15 text-red-300">
            <TimerOff className="size-6" aria-hidden="true" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">
            Reserva expirada
          </p>
          <h2 id="seat-timeout-title" className="text-xl font-bold text-white">
            Tu tiempo de 10 minutos se agotó
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5 text-center">
          <p id="seat-timeout-description" className="text-sm leading-relaxed text-slate-300">
            Por seguridad liberamos tu selección para que otros usuarios puedan continuar con su compra.
            {typeof releasedSeatsCount === 'number' && releasedSeatsCount > 0 ? (
              <>
                {' '}Se liberaron{' '}
                <span className="inline-flex items-center gap-1 font-semibold text-white">
                  <Armchair className="size-3.5" aria-hidden="true" />
                  {releasedSeatsCount} {releasedSeatsCount === 1 ? 'silla' : 'sillas'}
                </span>
                .
              </>
            ) : (
              <> Deberás seleccionar tus sillas nuevamente para continuar.</>
            )}
          </p>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-left">
            <p className="text-xs font-semibold text-amber-200">¿Qué sigue?</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
              Al aceptar, se reinicia el reloj de 10:00 y podrás elegir tus sillas desde cero.
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            autoFocus
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-[1.01] hover:bg-indigo-500 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Entendido, seleccionar nuevamente
          </button>

          <p className="text-[11px] text-slate-500">
            Esta ventana bloquea la compra hasta que aceptes. No podrás continuar con sillas liberadas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatTimeoutModal;
