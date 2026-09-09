import { useState, useEffect, useMemo } from 'react';
import type { Seat } from '../interfaces/seat.interface';
import { seatService } from '../services/seatService';

const TEN_MINUTES_IN_SECONDS = 600; // 10 minutos

export const useSeatSelection = (functionId: string) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(TEN_MINUTES_IN_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar mapa de sillas
  useEffect(() => {
    if (!functionId) return;

    const fetchSeats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedSeatIds([]);
        setReservationId(null);
        setIsTimerActive(false);
        setTimeLeft(TEN_MINUTES_IN_SECONDS);
        const data = await seatService.getSeatsByFunction(functionId);
        setSeats(data.seats);
      } catch {
        setError('Error al cargar la distribución de la sala.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [functionId]);

  // Selección y deselección de sillas
  const toggleSeatSelection = (seatId: string) => {
    const targetSeat = seats.find((s) => s.id === seatId);

    // Validar que no esté ocupada o inhabilitada
    if (!targetSeat || targetSeat.status === 'sold' || targetSeat.status === 'reserved' || targetSeat.status === 'disabled') {
      return;
    }

    setSelectedSeatIds((prev) => {
      const isAlreadySelected = prev.includes(seatId);
      if (isAlreadySelected) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Cálculo del total acumulado
  const totalPrice = useMemo(() => {
    return selectedSeatIds.reduce((sum, id) => {
      const seat = seats.find((s) => s.id === id);
      return sum + (seat ? seat.price : 0);
    }, 0);
  }, [selectedSeatIds, seats]);

  // Confirmar y Bloquear Sillas
  const handleLockSeats = async (): Promise<boolean> => {
    if (!functionId || selectedSeatIds.length === 0) return false;

    try {
      const response = await seatService.lockSeats({
        functionId,
        seatIds: selectedSeatIds,
      });
      setReservationId(response.reservationId);
      setIsTimerActive(true);
      return true;
    } catch {
      setError('Una o más sillas seleccionadas ya no están disponibles.');
      return false;
    }
  };

  // Control de la Cuenta Regresiva
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // Expiró el tiempo
      const expirationTask = setTimeout(() => {
        setIsTimerActive(false);
        if (reservationId) {
          seatService.releaseSeats(reservationId);
        }
        setSelectedSeatIds([]);
        alert('Tu tiempo de reserva ha expirado. Por favor, selecciona tus sillas nuevamente.');
      }, 0);

      return () => clearTimeout(expirationTask);
    }

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, reservationId]);

  return {
    seats,
    selectedSeatIds,
    totalPrice,
    timeLeft,
    isTimerActive,
    isLoading,
    error,
    toggleSeatSelection,
    handleLockSeats,
  };
};