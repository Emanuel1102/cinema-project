import React from "react";
import type { BookingStatus } from "../../interfaces/cancellation.interface";

interface Props {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<Props> = ({ status }) => {
  if (status === "CANCELLED") {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        CANCELADA / REEMBOLSADA
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
      PAGADO / CONFIRMADO
    </span>
  );
};