import { CheckCircle2, CircleDollarSign, XCircle } from "lucide-react";

export type BookingStatus = "PAID" | "CANCELLED" | "REFUNDED";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

type StatusAppearance = {
  label: string;
  description: string;
  className: string;
  Icon: typeof CheckCircle2;
};

const statusAppearance: Record<BookingStatus, StatusAppearance> = {
  PAID: {
    label: "Pagada",
    description: "Reserva pagada y vigente",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelada",
    description: "Reserva cancelada",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    Icon: XCircle,
  },
  REFUNDED: {
    label: "Reembolsada",
    description: "Reembolso procesado",
    className: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    Icon: CircleDollarSign,
  },
};

export const BookingStatusBadge = ({ status, className = "" }: BookingStatusBadgeProps) => {
  const appearance = statusAppearance[status];
  const { Icon } = appearance;

  return (
    <span
      aria-label={`Estado de reserva: ${appearance.description}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${appearance.className} ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.25} />
      <span>{appearance.label}</span>
    </span>
  );
};

export default BookingStatusBadge;