import type { SeatStatus, SeatType } from "../../interfaces/seat.interface";
import { SeatIndicator } from "./SeatItem";

type LegendItem = {
    key: SeatStatus | SeatType;
    label: string;
};

const legendItems: LegendItem[] = [
    { key: "available", label: "Disponible" },
    { key: "selected", label: "Seleccionada" },
    { key: "reserved", label: "Reservada" },
    { key: "sold", label: "Vendida" },
    { key: "disabled", label: "Inhabilitada" },
    { key: "preferential", label: "Preferencial" },
    { key: "vip", label: "VIP" },
];

export interface SeatLegendProps {
    className?: string;
}

export const SeatLegend = ({ className = "" }: SeatLegendProps) => {
    return (
        <div
            aria-label="Leyenda del mapa de sillas"
            role="list"
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground ${className}`}
        >
            {legendItems.map(({ key, label }) => (
                <span key={key} role="listitem" className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <SeatIndicator state={key} />
                    <span>{label}</span>
                </span>
            ))}
        </div>
    );
};

export default SeatLegend;