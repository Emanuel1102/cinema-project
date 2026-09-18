import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Ticket, Calendar, Armchair, ArrowRight, Download } from "lucide-react";
import type { Seat } from "../interfaces/seat.interface";
import { BackToHomeButton } from "@/shared/components";

interface OrderConfirmationData {
  orderId: string;
  seats: Seat[];
  totalPaid: number;
  date: string;
}

export const OrderSuccessView: React.FC = () => {
  const navigate = useNavigate();

  const [orderData] = useState<OrderConfirmationData | null>(() => {
    const raw = sessionStorage.getItem("order_confirmation");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as OrderConfirmationData;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!orderData) {
      navigate("/movies");
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const formattedDate = new Date(orderData.date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#070913] text-[#e8e8ed] px-4 sm:px-8 py-10 selection:bg-purple-600 selection:text-white pb-20">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex justify-end">
          <BackToHomeButton />
        </div>

        {/* Encabezado de éxito */}
        <div className="text-center space-y-2">
          <div className="size-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">¡Pago Exitoso!</h1>
          <p className="text-xs text-slate-400">
            Tu reserva ha sido confirmada y tus boletas digitales ya están emitidas.
          </p>
        </div>

        {/* Tarjeta Tipo Ticket / Boleta */}
        <div className="bg-[#111424] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="bg-purple-600/20 border-b border-white/10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Ticket className="size-4" />
              <span>Boleta Digital de Cine</span>
            </div>
            <span className="font-mono text-xs font-black text-purple-200">
              {orderData.orderId}
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-purple-400" />
                  Fecha de Compra
                </span>
                <p className="font-semibold text-white">{formattedDate}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Armchair className="size-3.5 text-purple-400" />
                  Sillas Asignadas
                </span>
                <p className="font-semibold text-purple-300">
                  {orderData.seats.map((s) => s.id).join(", ")}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-white/15 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Pagado</span>
              <span className="text-lg font-black text-white font-mono">
                ${orderData.totalPaid.toLocaleString()} COP
              </span>
            </div>

            {/* Código QR Simulado */}
            <div className="bg-[#070913] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
              <div className="size-36 bg-white rounded-xl p-2 flex items-center justify-center shadow-inner">
                {/* Visual simulador de QR mediante CSS */}
                <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center text-[10px] font-mono text-black font-black text-center">
                  CÓDIGO QR<br />{orderData.orderId}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Presenta este código en la entrada de la sala para escanear tus boletas.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl text-xs font-semibold bg-[#111424] hover:bg-[#181c33] border border-white/15 text-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="size-4" />
            Descargar Comprobante
          </button>

          <button
            type="button"
            onClick={() => navigate("/movies")}
            className="flex-1 py-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Ir a la Cartelera
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessView;