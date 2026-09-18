import React, { useState } from "react";
import { Ticket, Calendar, Armchair, QrCode, Film, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import type { Seat } from "../interfaces/seat.interface";

interface StoredBooking {
  orderId: string;
  functionId: string;
  seats: (Seat | string)[];
  totalPaid: number;
  paymentMethod: string;
  customer: {
    fullName: string;
    email: string;
  };
  date: string;
  status: string;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Inicialización diferida: lee localStorage de inmediato sin renders en cascada
  const [bookings] = useState<StoredBooking[]>(() => {
    try {
      const raw = localStorage.getItem("user_booking_history");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Error leyendo historial de compras:", err);
      return [];
    }
  });

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

        <div className="bg-[#111424] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="size-20 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-purple-600/40">
            JB
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Mi Cuenta & Boletas</h1>
            <p className="text-xs text-slate-400">
              Gestiona tus compras recientes y presenta tus códigos de acceso en sala.
            </p>
          </div>
        </div>

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
              {bookings.map((item) => {
                const formattedDate = new Date(item.date).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const seatLabels = item.seats
                  .map((s) => (typeof s === "string" ? s : s.id))
                  .join(", ");

                return (
                  <div
                    key={item.orderId}
                    className="bg-[#111424] border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
                  >
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-xs font-black text-purple-400">
                          {item.orderId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                          PAGADO / CONFIRMADO
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="size-3 text-purple-400" />
                            Función
                          </span>
                          <p className="font-semibold text-white">{item.functionId}</p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Armchair className="size-3 text-purple-400" />
                            Sillas
                          </span>
                          <p className="font-semibold text-purple-300">{seatLabels}</p>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="size-3 text-purple-400" />
                            Fecha
                          </span>
                          <p className="font-semibold text-white">{formattedDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-center p-3 bg-[#070913] border border-white/10 rounded-xl gap-2 w-full md:w-auto shrink-0">
                      <QrCode className="size-8 text-white" />
                      <span className="text-[10px] font-mono text-slate-400 text-center">
                        Acceso Sala
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;