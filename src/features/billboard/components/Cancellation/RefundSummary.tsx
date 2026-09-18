import React from 'react';
import { CreditCard, Banknote, Clock, ArrowDownLeft, Wallet } from 'lucide-react';
import { formatCOP } from '@/lib/data';
import type { PaymentMethodType } from '@/features/billboard/interfaces/payment.interface';

interface RefundSummaryProps {
  /** Monto original pagado por la reservación. */
  originalAmount: number;
  /** Método de pago utilizado. */
  method: PaymentMethodType;
  /** ID de la reservación (informativo). */
  reservationId?: string;
  /** Porcentaje de retención de servicio digital. Se calcula automáticamente si no se pasa. */
  retentionPercent?: number;
  /** Días hábiles estimados de acreditación. Se calcula automáticamente si no se pasa. */
  estimatedDays?: number;
  className?: string;
}

const METHOD_CONFIG: Record<
  PaymentMethodType,
  { label: string; icon: React.ElementType; retention: number; days: number }
> = {
  pse: {
    label: 'PSE',
    icon: Banknote,
    retention: 1.0,
    days: 2,
  },
  card: {
    label: 'Tarjeta',
    icon: CreditCard,
    retention: 4.0,
    days: 5,
  },
};

export function RefundSummary({
  originalAmount,
  method,
  reservationId,
  retentionPercent,
  estimatedDays,
  className = '',
}: RefundSummaryProps) {
  const config = METHOD_CONFIG[method];
  const safeRetention = retentionPercent ?? config.retention;
  const safeDays = estimatedDays ?? config.days;

  const retentionAmount = Math.round(originalAmount * (safeRetention / 100));
  const netRefund = originalAmount - retentionAmount;
  const isPse = method === 'pse';

  return (
    <section
      role="region"
      aria-label="Resumen financiero del reembolso"
      className={`surface-panel w-full max-w-lg space-y-4 p-5 shadow-card ${className}`}
    >
      <header className="flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-emerald-500/15 text-emerald-400">
          <ArrowDownLeft className="size-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <h2 className="text-lg font-bold text-white">Resumen de reembolso</h2>
          <p className="text-xs text-muted-foreground">
            Transparencia contable de tu devolución
          </p>
        </div>
      </header>

      <dl className="space-y-3">
        {/* Monto original */}
        <div className="flex items-start justify-between gap-3 rounded-xl bg-black/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
              <Wallet className="size-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Monto original pagado
              </dt>
              <dd className="text-sm font-medium text-white">
                {reservationId ? `Boleta #${reservationId} · ` : ''}
                {formatCOP(originalAmount)}
              </dd>
            </div>
          </div>
        </div>

        {/* Método receptor */}
        <div className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <config.icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Método receptor
              </dt>
              <dd className="text-sm font-medium text-white">{config.label}</dd>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isPse
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-blue-500/15 text-blue-300'
            }`}
          >
            {isPse ? '✓ Confirmado' : '○ Pendiente'}
          </span>
        </div>

        {/* Retención de servicio digital */}
        <div className="flex items-start justify-between gap-3 rounded-xl bg-red-950/20 px-4 py-3 border border-red-500/10">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-red-500/15 text-red-300">
              <Clock className="size-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-red-200">
                Retención servicio digital
              </dt>
              <dd className="text-sm font-medium text-red-100">
                {safeRetention.toFixed(1)}% · {formatCOP(retentionAmount)}
              </dd>
            </div>
          </div>
          <span className="text-xs text-red-300/80">Comisión plataforma</span>
        </div>

        {/* Neto a devolver */}
        <div className="flex items-start justify-between gap-3 rounded-xl bg-emerald-950/30 px-4 py-3 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
              <ArrowDownLeft className="size-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                Neto a devolver
              </dt>
              <dd className="text-lg font-bold text-emerald-100">
                {formatCOP(netRefund)}
              </dd>
            </div>
          </div>
          <span className="text-xs text-emerald-300/80">Saldo final</span>
        </div>

        {/* Tiempo estimado de acreditación */}
        <div className="rounded-xl bg-slate-900/50 px-4 py-3 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-slate-700/50 text-slate-300">
                <Clock className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Acreditación estimada
                </dt>
                <dd className="text-sm font-medium text-white">
                  {safeDays} {safeDays === 1 ? 'día hábil' : 'días hábiles'}
                </dd>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-300">
              {isPse ? 'Rápido' : 'Estándar'}
            </span>
          </div>
        </div>
      </dl>

      <p className="text-center text-[11px] text-slate-500">
      {/* TODO: Replace with real gateway data */}
      </p>
      <p className="text-center text-[11px] text-slate-500">
        El reembolso se procesará automáticamente al confirmar la cancelación.
        Recibirás una confirmación por correo electrónico.
      </p>
    </section>
  );
}

export default RefundSummary;
