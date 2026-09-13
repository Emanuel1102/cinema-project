import React, { useMemo, useState } from "react";
import type { Seat, SeatStatus, SeatType } from "../../interfaces/seat.interface";
import { SeatItem } from "./SeatItem";
import { ScreenIndicator } from "./ScreenIndicator";
import { SeatLegend } from "./SeatLegend";

export type { Seat, SeatStatus, SeatType };

export interface RoomLayoutProps {
  /**
   * Array of seats representing the room matrix.
   * If omitted or empty, realistic fallback mock seats will be displayed.
   */
  seats?: Seat[];
  /**
   * Array of currently selected seat IDs (controlled mode).
   */
  selectedSeatIds?: string[];
  /**
   * Callback invoked whenever a seat is clicked.
   */
  onSeatSelect?: (seatId: string) => void;
  /**
   * Custom label for the curved screen indicator at the top.
   * Defaults to "PANTALLA".
   */
  screenLabel?: string;
  /**
   * Seat numbers after which an aisle gap should be rendered.
   * Defaults to [2, 8] for classic 10-seat rows.
   */
  aisleAfterNumbers?: number[];
  /**
   * Whether to render the SeatLegend component below the matrix.
   * Defaults to true.
   */
  showLegend?: boolean;
  /**
   * Additional Tailwind classes applied to the root container.
   */
  className?: string;
}

/**
 * Realistic cinema room mock data (~60 seats across 6 rows: A-F)
 * Includes standard, preferential, and VIP seats with realistic statuses.
 */
export const DEFAULT_MOCK_SEATS: Seat[] = [
  // Rows A-B: Standard front seats
  ...["A", "B"].flatMap((row) =>
    Array.from({ length: 10 }, (_, i) => {
      const num = i + 1;
      let status: SeatStatus = "available";
      if (row === "A" && (num === 4 || num === 5)) status = "sold";
      if (row === "B" && (num === 1 || num === 2)) status = "reserved";
      return {
        id: `seat-${row}-${num}`,
        row,
        number: num,
        status,
        type: "standard" as SeatType,
        price: 14000,
      };
    })
  ),
  // Rows C-D: Standard center seats
  ...["C", "D"].flatMap((row) =>
    Array.from({ length: 10 }, (_, i) => {
      const num = i + 1;
      let status: SeatStatus = "available";
      if (row === "C" && (num === 7 || num === 8)) status = "sold";
      if (row === "D" && num === 5) status = "reserved";
      return {
        id: `seat-${row}-${num}`,
        row,
        number: num,
        status,
        type: "standard" as SeatType,
        price: 16000,
      };
    })
  ),
  // Row E: Preferential seats
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    const status: SeatStatus = num === 10 ? "disabled" : "available";
    return {
      id: `seat-E-${num}`,
      row: "E",
      number: num,
      status,
      type: "preferential" as SeatType,
      price: 21000,
    };
  }),
  // Row F: VIP back luxury seats
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    const status: SeatStatus = num === 5 || num === 6 ? "sold" : "available";
    return {
      id: `seat-F-${num}`,
      row: "F",
      number: num,
      status,
      type: "vip" as SeatType,
      price: 28000,
    };
  }),
];

const DEFAULT_AISLE_NUMBERS = [2, 8];

export const RoomLayout: React.FC<RoomLayoutProps> = ({
  seats = DEFAULT_MOCK_SEATS,
  selectedSeatIds,
  onSeatSelect,
  screenLabel = "PANTALLA",
  aisleAfterNumbers = DEFAULT_AISLE_NUMBERS,
  showLegend = true,
  className = "",
}) => {
  // Support both controlled and uncontrolled selection
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const isControlled = selectedSeatIds !== undefined;
  const activeSelectedIds = isControlled ? selectedSeatIds : internalSelectedIds;

  const handleSeatClick = (seatId: string) => {
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
    if (!isControlled) {
      setInternalSelectedIds((prev) =>
        prev.includes(seatId)
          ? prev.filter((id) => id !== seatId)
          : [...prev, seatId]
      );
    }
  };

  // Group seats by row and sort dynamically
  const { sortedRows, grouped } = useMemo(() => {
    const effectiveSeats = seats && seats.length > 0 ? seats : DEFAULT_MOCK_SEATS;
    const map: Record<string, Seat[]> = {};

    for (const seat of effectiveSeats) {
      if (!map[seat.row]) {
        map[seat.row] = [];
      }
      map[seat.row].push(seat);
    }

    // Sort rows alphabetically (e.g., A, B, C...)
    const sorted = Object.keys(map).sort((a, b) => a.localeCompare(b));

    // Sort seats in each row by ascending number
    for (const rowKey of sorted) {
      map[rowKey].sort((a, b) => a.number - b.number);
    }

    return { sortedRows: sorted, grouped: map };
  }, [seats]);

  // Check whether an aisle gap should be rendered after this seat
  const shouldRenderAisle = (seat: Seat, index: number, rowSeats: Seat[]) => {
    if (index === rowSeats.length - 1) return false;
    const nextSeat = rowSeats[index + 1];
    // Natural aisle gap if seat numbers jump
    if (nextSeat && nextSeat.number - seat.number > 1) {
      return true;
    }
    // Configured aisle positions
    if (aisleAfterNumbers.includes(seat.number)) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`relative flex w-full flex-col items-center rounded-2xl border border-border bg-background/80 p-4 sm:p-8 backdrop-blur-sm shadow-card ${className}`}
    >
      {/* 1. Screen Indicator at top with proper spacing */}
      <div className="w-full max-w-2xl mb-8 sm:mb-12">
        <ScreenIndicator label={screenLabel} />
      </div>

      {/* 2. Resilient Scrollable Seat Matrix Container */}
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
                  {/* Left flank row badge */}
                  <div
                    aria-hidden="true"
                    className="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/80 text-xs font-bold text-muted-foreground shadow-xs select-none shrink-0 transition-colors"
                  >
                    {rowKey}
                  </div>

                  {/* Seat Items with aisle spacing */}
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

                  {/* Right flank row badge */}
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

      {/* 3. Optional Legend Indicator */}
      {showLegend && (
        <div className="mt-8 pt-6 border-t border-border/60 w-full flex justify-center">
          <SeatLegend />
        </div>
      )}
    </div>
  );
};

export default RoomLayout;
