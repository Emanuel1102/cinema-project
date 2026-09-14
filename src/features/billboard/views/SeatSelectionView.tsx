import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Seat, SeatMapResponse } from '../interfaces/seat.interface';
import { seatService } from '../services/seatService';
import { RoomLayout } from '../components/SeatMap/RoomLayout';
import { BackToHomeButton } from '@/shared/components';

type ExtendedSeatMapResponse = SeatMapResponse & {
  seats?: Seat[];
  movieTitle?: string;
  roomName?: string;
  showtime?: string;
};

export const SeatSelectionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState<SeatMapResponse | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar datos de la función desde el mock
  useEffect(() => {
    seatService
      .getSeatsByFunction(id || 'f-101')
      .then((data: SeatMapResponse) => {
        setRoomData(data);
        const extendedData = data as unknown as ExtendedSeatMapResponse;
        const rawSeats = Array.isArray(data)
          ? (data as Seat[])
          : extendedData.seats || [];
        setSeats(rawSeats);
      })
      .catch((err: unknown) => console.error('Error cargando sala:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Temporizador de sesión de 10 minutos
  useEffect(() => {
    if (selectedSeatIds.length === 0 || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeatIds.length, isExpired]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Selección y deselección local protegida
  const handleSelectSeat = (seatId: string) => {
    if (isExpired) return;

    const targetSeat = seats.find((s) => s.id === seatId);
    if (
      !targetSeat ||
      targetSeat.status === 'sold' ||
      targetSeat.status === 'reserved' ||
      targetSeat.status === 'disabled'
    ) {
      return;
    }

    const isAlreadySelected = selectedSeatIds.includes(seatId);

    if (isAlreadySelected) {
      setSelectedSeatIds((prev) => prev.filter((s) => s !== seatId));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('Solo puedes seleccionar un máximo de 8 sillas por compra.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seatId]);
    }
  };

  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, s) => acc + (s.price || 15000), 0);
  }, [selectedSeats]);

  // Continuar a la pasarela de pago (HU-11)
  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedSeatIds.length === 0 || isExpired) return;

    const generatedReservationId = `res-${Date.now()}`;

    sessionStorage.setItem(
      'checkout_selection',
      JSON.stringify({
        functionId: id || 'f-101',
        reservationId: generatedReservationId,
        seats: selectedSeats,
        totalPrice,
      })
    );

    navigate('/checkout/payment');
  };

  const extendedRoomData = roomData as unknown as ExtendedSeatMapResponse | null;

  if (loading || !roomData) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Cargando distribución de sala...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-[#e8e8ed] px-4 sm:px-8 py-8 relative selection:bg-purple-600 selection:text-white pb-36">
      {isExpired && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111424] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <span className="text-4xl mb-2 block">⏳</span>
            <h3 className="text-lg font-bold text-white mb-1">Tiempo de Reserva Expirado</h3>
            <p className="text-xs text-slate-400 mb-6">
              Los 10 minutos para completar tu selección han finalizado. Las sillas han sido liberadas.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Reiniciar Selección
            </button>
          </div>
        </div>
      )}

      {/* Navegación superior */}
      <div className="max-w-5xl mx-auto mb-6">
        <BackToHomeButton />
      </div>

      <main className="max-w-5xl mx-auto space-y-8">
        <header className="bg-[#111424]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {extendedRoomData?.movieTitle || 'Selección de Sillas'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {extendedRoomData?.roomName || 'Sala General'} • {extendedRoomData?.showtime || 'Función Seleccionada'}
            </p>
          </div>

          {selectedSeatIds.length > 0 && (
            <div className="flex items-center gap-2.5 bg-purple-950/60 border border-purple-500/40 px-4 py-2 rounded-xl">
              <span className="text-purple-400 text-xs font-semibold">Tiempo restante:</span>
              <span className="font-mono text-sm font-black text-purple-200">{formattedTime}</span>
            </div>
          )}
        </header>

        {/* Sala matricial */}
        <RoomLayout
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          onSeatSelect={handleSelectSeat}
          showLegend={true}
        />
      </main>

      {/* Barra de resumen inferior */}
      <aside className="fixed bottom-0 left-0 w-full bg-[#0b0f19]/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sillas ({selectedSeatIds.length}/8):</span>
              <span className="text-xs font-bold text-white">
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => s.id).join(', ')
                  : 'Ninguna seleccionada'}
              </span>
            </div>
            <p className="text-xl font-black text-white mt-0.5">
              ${totalPrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">COP</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedSeatIds.length === 0 || isExpired}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg shadow-purple-600/30 transition active:scale-95 cursor-pointer"
          >
            Continuar al Pago →
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SeatSelectionView;