import React from "react";

interface Props {
  totalPaid: number;
  paymentMethod: string;
}

export const RefundSummary: React.FC<Props> = ({ totalPaid, paymentMethod }) => {
  return (
    <div className="bg-[#070913] border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs">
      <div className="flex justify-between text-slate-400">
        <span>Valor original pagado:</span>
        <span className="text-white font-mono">${totalPaid.toLocaleString()} COP</span>
      </div>
      <div className="flex justify-between text-slate-400">
        <span>Retención administrativa:</span>
        <span className="text-emerald-400 font-mono">$0 COP (100% Reembolso)</span>
      </div>
      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
        <span className="text-white">Monto a reembolsar:</span>
        <span className="text-purple-400 font-mono">${totalPaid.toLocaleString()} COP</span>
      </div>
      <p className="text-[11px] text-slate-500 pt-1">
        El reembolso se procesará al método original ({paymentMethod.toUpperCase()}) en un plazo estimado de 1 a 3 días hábiles.
      </p>
    </div>
  );
};