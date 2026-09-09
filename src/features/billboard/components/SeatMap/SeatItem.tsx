import { Armchair } from "lucide-react";
import type { Seat, SeatStatus, SeatType } from "../../interfaces/seat.interface";

export interface SeatItemProps {
    seat: Seat;
    isSelected?: boolean;
    onSelect: (seatId: string) => void;
}

type SeatVisualState = {
    label: string;
    className: string;
};

const seatVisualStates: Record<SeatStatus | SeatType, SeatVisualState> = {
    available: {
        label: "Disponible",
        className: "border-border bg-secondary text-muted-foreground hover:border-accent hover:bg-accent/15 hover:text-accent",
    },
    selected: {
        label: "Seleccionada",
        className: "border-primary bg-primary text-primary-foreground shadow-[0_0_0_3px_rgba(99,102,241,0.2)]",
    },
    reserved: {
        label: "Reservada",
        className: "cursor-not-allowed border-border bg-muted/70 text-muted-foreground opacity-60",
    },
    sold: {
        label: "Vendida",
        className: "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-45",
    },
    disabled: {
        label: "Inhabilitada",
        className: "cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-45",
    },
    standard: {
        label: "Estándar",
        className: "",
    },
    preferential: {
        label: "Preferencial",
        className: "border-accent/70",
    },
    vip: {
        label: "VIP",
        className: "border-[#DB2777]/70 text-[#F472B6]",
    },
};

export const SeatIcon = ({ className = "size-4" }: { className?: string }) => (
    <Armchair aria-hidden="true" className={className} strokeWidth={2} />
);

const getSeatVisualClassName = (state: SeatStatus | SeatType) => {
    if (state === "standard") return seatVisualStates.available.className;
    if (state === "preferential" || state === "vip") {
        return `${seatVisualStates.available.className} ${seatVisualStates[state].className}`;
    }
    return seatVisualStates[state].className;
};

export const SeatIndicator = ({ state }: { state: SeatStatus | SeatType }) => (
    <span
        aria-hidden="true"
        className={`flex size-7 items-center justify-center rounded-lg border ${getSeatVisualClassName(state)}`}
    >
        <SeatIcon className="size-4" />
    </span>
);

const unavailableStatuses: SeatStatus[] = ["reserved", "sold", "disabled"];

const getSeatState = (seat: Seat, isSelected: boolean): SeatStatus => {
    if (isSelected || seat.status === "selected") return "selected";
    return seat.status;
};

export const SeatItem = ({ seat, isSelected = false, onSelect }: SeatItemProps) => {
    const state = getSeatState(seat, isSelected);
    const isUnavailable = unavailableStatuses.includes(seat.status);
    const visualState = seatVisualStates[state];
    const typeState = seatVisualStates[seat.type];
    const canSelect = !isUnavailable;
    const label = `Fila ${seat.row}, silla ${seat.number}: ${visualState.label}${seat.type !== "standard" ? `, ${typeState.label}` : ""}`;

    return (
        <button
            type="button"
            disabled={!canSelect}
            aria-label={label}
            aria-pressed={state === "selected"}
            title={seat.price > 0 ? `${label} · ${seat.price}` : label}
            onClick={() => onSelect(seat.id)}
            className={[
                "group relative flex size-11 items-center justify-center rounded-xl border text-xs transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-12",
                visualState.className,
                state === "available" && getSeatVisualClassName(seat.type),
                canSelect ? "cursor-pointer active:scale-95" : "",
            ].join(" ")}
        >
            <SeatIcon className="size-5 transition-transform group-hover:scale-105" />
            <span className="sr-only">{label}</span>
        </button>
    );
};

export default SeatItem;