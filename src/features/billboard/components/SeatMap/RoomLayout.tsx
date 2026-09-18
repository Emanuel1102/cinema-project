import React, { useMemo, useState } from "react";
import type { Seat } from "../../interfaces/seat.interface";
import { SeatItem } from "./SeatItem";
import { ScreenIndicator } from "./ScreenIndicator";
import { SeatLegend } from "./SeatLegend";

export interface RoomLayoutProps {
  seats?: Seat[];
  selectedSeatIds?: string[];
  onSeatSelect?: (seatId: string) => void;
  screenLabel?: string;
  aisleAfterNumbers?: number[];
  showLegend?: boolean;
  className?: string;
}

const DEFAULT_AISLE_NUMBERS = [2, 8];

export const RoomLayout: React.FC<RoomLayoutProps> = ({
  seats = [],
  selectedSeatIds = [],
  onSeatSelect,
  screenLabel = "PANTALLA",
  aisleAfterNumbers = DEFAULT_AISLE_NUMBERS,
  showLegend = true,
  className = "",
}) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);

  // Si el padre pasa selectedSeatIds (incluso vacío []), se usa el padre
  const activeSelectedIds = selectedSeatIds.length > 0 || onSeatSelect 
    ? selectedSeatIds 
    : internalSelectedIds;

  const handleSeatClick = (seatId: string) => {
    if (onSeatSelect) {
      onSeatSelect(seatId);
    } else {
      setInternalSelectedIds((prev) =>
        prev.includes(seatId)
          ? prev.filter((id) => id !== seatId)
          : [...prev, seatId]
      );
    }
  };

  // Agrupar sillas por fila
  const { sortedRows, grouped } = useMemo(() => {
    const map: Record<string, Seat[]> = {};

    for (const seat of seats) {
      if (!map[seat.row]) {
        map[seat.row] = [];
      }
      map[seat.row].push(seat);
    }

    const sorted = Object.keys(map).sort((a, b) => a.localeCompare(b));

    for (const rowKey of sorted) {
      map[rowKey].sort((a, b) => a.number - b.number);
    }

    return { sortedRows: sorted, grouped: map };
  }, [seats]);

  const shouldRenderAisle = (seat: Seat, index: number, rowSeats: Seat[]) => {
    if (index === rowSeats.length - 1) return false;
    const nextSeat = rowSeats[index + 1];

    if (nextSeat && nextSeat.number - seat.number > 1) {
      return true;
    }
    if (aisleAfterNumbers.includes(seat.number)) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`relative flex w-full flex-col items-center rounded-2xl border border-border bg-background/80 p-4 sm:p-8 backdrop-blur-sm shadow-card ${className}`}
    >
      {/* 1. Indicador curvo de pantalla */}
      <div className="w-full max-w-2xl mb-8 sm:mb-12">
        <ScreenIndicator label={screenLabel} />
      </div>

      {/* 2. Matriz de sillas */}
      <div
        tabIndex={0}
        aria-label="Plano de asientos de la sala con desplazamiento horizontal"
        className="w-full overflow-x-auto pb-6 pt-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent"
      >
        <div className="min-w-fit mx-auto flex flex-col items-center justify-center px-4 sm:px-8">
          <div
            role="grid"
            aria-label="Distribución de sillas"
            className="flex flex-col items-center gap-3 sm:gap-4"
          >
            {sortedRows.map((rowKey) => {
              const rowSeats = grouped[rowKey] || [];

              return (
                <div
                  key={rowKey}
                  role="row"
                  aria-label={`Fila ${rowKey}`}
                  className="flex items-center justify-center gap-2 sm:gap-3 flex-nowrap"
                >
                  {/* Letra lateral izquierda */}
                  <div
                    aria-hidden="true"
                    className="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/80 text-xs font-bold text-muted-foreground shadow-xs select-none shrink-0 transition-colors"
                  >
                    {rowKey}
                  </div>

                  {/* Fila de sillas */}
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap">
                    {rowSeats.map((seat, seatIdx) => {
                      const isAisle = shouldRenderAisle(seat, seatIdx, rowSeats);
                      const isSelected = activeSelectedIds.includes(seat.id);

                      return (
                        <div
                          key={seat.id}
                          role="gridcell"
                          className={`flex items-center ${
                            isAisle ? "mr-4 sm:mr-8" : ""
                          }`}
                        >
                          <SeatItem
                            seat={seat}
                            isSelected={isSelected}
                            onSelect={handleSeatClick}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Letra lateral derecha */}
                  <div
                    aria-hidden="true"
                    className="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/80 text-xs font-bold text-muted-foreground shadow-xs select-none shrink-0 transition-colors"
                  >
                    {rowKey}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Leyenda */}
      {showLegend && (
        <div className="mt-8 pt-6 border-t border-border/60 w-full flex justify-center">
          <SeatLegend />
        </div>
      )}
    </div>
  );
};

export default RoomLayout;