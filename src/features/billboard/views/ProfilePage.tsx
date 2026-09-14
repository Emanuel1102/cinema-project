import React, { useState } from "react";
import { Ticket, Film, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import type { StoredBooking } from "../interfaces/cancellation.interface";
import { cancellationService } from "../services/cancellationService";
import { BookingTicketCard, CancelConfirmModal } from "../components/Cancellation";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Inicialización diferida: lee localStorage de inmediato sin renders en cascada
  const [bookings, setBookings] = useState<StoredBooking[]>(() => {
    try {
      const raw = localStorage.getItem("user_booking_history");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Error leyendo historial de compras:", err);
      return [];
    }
  });

  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<StoredBooking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleOpenCancelModal = (booking: StoredBooking) => {
    setSelectedBookingForCancel(booking);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    if (cancelling) return;
    setIsCancelModalOpen(false);
    setSelectedBookingForCancel(null);
  };

  const handleConfirmCancellation = async (orderId: string) => {
    setCancelling(true);
    try {
      await cancellationService.cancelBooking(orderId);

      // Mutación reactiva inmediata en el estado local sin recargar pantalla
      setBookings((prev) =>
        prev.map((b) => (b.orderId === orderId ? { ...b, status: "CANCELLED" } : b))
      );

      setIsCancelModalOpen(false);
      setSelectedBookingForCancel(null);
      alert("La reserva fue cancelada exitosamente y las sillas han sido liberadas.");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al anular la reserva. Por favor intenta de nuevo.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-[#e8e8ed] px-4 sm:px-8 py-8 selection:bg-purple-600 selection:text-white pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          type="button"
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Volver a la cartelera
        </button>

        {/* Encabezado del Perfil */}
        <div className="bg-[#111424] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="size-20 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-purple-600/40">
            JB
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Mi Cuenta & Boletas</h1>
            <p className="text-xs text-slate-400">
              Gestiona tus compras recientes, presenta tus códigos de acceso o cancela reservas activas.
            </p>
          </div>
        </div>

        {/* Listado de Boletas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Ticket className="size-4 text-purple-400" />
              Historial de Boletas ({bookings.length})
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-[#111424]/60 border border-white/10 rounded-2xl p-12 text-center space-y-3">
              <Film className="size-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">Aún no tienes boletas registradas</p>
              <p className="text-xs text-slate-500">
                Cuando reserves tus entradas para una función aparecerán aquí para fácil acceso.
              </p>
              <button
                type="button"
                onClick={() => navigate("/movies")}
                className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Explorar Cartelera
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingTicketCard
                  key={booking.orderId}
                  booking={booking}
                  onOpenCancelModal={handleOpenCancelModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cancelación Orquestado */}
      {selectedBookingForCancel && (
        <CancelConfirmModal
          booking={selectedBookingForCancel}
          isOpen={isCancelModalOpen}
          loading={cancelling}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancellation}
        />
      )}
    </div>
  );
};

export default ProfilePage;