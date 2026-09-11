import React from 'react';
import { Timer, TriangleAlert } from 'lucide-react';

export const RESERVATION_TOTAL_SECONDS = 600; 
export const RESERVATION_WARNING_THRESHOLD = 120; 
export const RESERVATION_CRITICAL_THRESHOLD = 60; 

interface ReservationTimerProps {
  /** Tiempo restante en segundos. Lo provee el padre (ej: useSeatSelection.timeLeft). */
  timeLeftSeconds: number;
  /** Duración total de la reserva. Por defecto 600 (10 min). */
  totalSeconds?: number;
  /** Umbral para mostrar alerta visual. Por defecto 120 (2 min). */
  warningThresholdSeconds?: number;
  /** Umbral para estado crítico. Por defecto 60 (1 min). */
  criticalThresholdSeconds?: number;
  className?: string;
}

function formatMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const ReservationTimer: React.FC<ReservationTimerProps> = ({
  timeLeftSeconds,
  totalSeconds = RESERVATION_TOTAL_SECONDS,
  warningThresholdSeconds = RESERVATION_WARNING_THRESHOLD,
  criticalThresholdSeconds = RESERVATION_CRITICAL_THRESHOLD,
  className = '',
}) => {
  const safeTotal = Math.max(1, Math.floor(totalSeconds));
  const safeTimeLeft = Math.min(safeTotal, Math.max(0, Math.floor(timeLeftSeconds)));
  const isExpired = safeTimeLeft <= 0;
  const isCritical = !isExpired && safeTimeLeft <= criticalThresholdSeconds;
  const isWarning = !isExpired && !isCritical && safeTimeLeft <= warningThresholdSeconds;
  const progress = (safeTimeLeft / safeTotal) * 100;

  const containerStyles = isExpired
    ? 'border-red-500/40 bg-red-950/60 text-red-200'
    : isCritical
      ? 'border-red-500/40 bg-red-950/40 text-red-100'
      : isWarning
        ? 'border-amber-500/40 bg-amber-950/40 text-amber-100'
        : 'border-purple-500/30 bg-purple-950/80 text-purple-200';

  const barStyles = isExpired || isCritical
    ? 'bg-red-500'
    : isWarning
      ? 'bg-amber-400'
      : 'bg-emerald-400';

  const statusLabel = isExpired
    ? 'Tiempo agotado'
    : isCritical
      ? '¡Último minuto! Tu selección está por liberarse'
      : isWarning
        ? 'Tu selección expira pronto'
        : 'Tiempo para completar tu reserva';

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Tiempo restante de reserva: ${formatMmSs(safeTimeLeft)}`}
      className={`inline-flex w-full max-w-sm flex-col gap-2 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md ${containerStyles} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-black/30">
            {isWarning || isCritical || isExpired ? (
              <TriangleAlert className="size-4" aria-hidden="true" />
            ) : (
              <Timer className="size-4" aria-hidden="true" />
            )}
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
              Reserva temporal
            </p>
            <p className="text-xs font-medium opacity-90">{statusLabel}</p>
          </div>
        </div>
        <span
          aria-hidden="true"
          className={`font-mono text-2xl font-bold tabular-nums tracking-tight ${isCritical || isExpired ? 'animate-pulse' : ''}`}
        >
          {formatMmSs(safeTimeLeft)}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeTimeLeft}
        aria-label="Progreso del tiempo de reserva"
        className="h-1.5 w-full overflow-hidden rounded-full bg-black/40"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${barStyles}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {isWarning || isCritical ? (
        <p className="text-[11px] font-medium leading-snug opacity-90">
          Alerta: si el reloj llega a 00:00 perderás tu selección y deberás elegir tus sillas nuevamente.
        </p>
      ) : null}
    </div>
  );
};

export default ReservationTimer;
