import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Plus, Minus, Popcorn, ArrowRight, ArrowLeft } from "lucide-react";
import type { SnackItem, SelectedSnack } from "../interfaces/snack.interface";
import type { CheckoutSessionData } from "../interfaces/payment.interface";
import { snackService } from "../services/snackService";
import { BackToHomeButton } from "@/shared/components";

export const SnacksSelectionView: React.FC = () => {
  const navigate = useNavigate();
  const [snacks, setSnacks] = useState<SnackItem[]>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [sessionData] = useState<CheckoutSessionData | null>(() => {
    const raw = sessionStorage.getItem("checkout_selection");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CheckoutSessionData;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!sessionData) {
      navigate("/movies");
      return;
    }

    snackService
      .getSnacks()
      .then((data) => setSnacks(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [sessionData, navigate]);

  const handleAdd = (id: string) => {
    setSelectedSnacks((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: string) => {
    setSelectedSnacks((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const snacksTotal = useMemo(() => {
    return Object.entries(selectedSnacks).reduce((sum, [id, qty]) => {
      const item = snacks.find((s) => s.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [selectedSnacks, snacks]);

  const grandTotal = (sessionData?.totalPrice || 0) + snacksTotal;

  const handleContinue = () => {
    if (!sessionData) return;

    const chosenSnacksList: SelectedSnack[] = Object.entries(selectedSnacks)
      .map(([id, quantity]) => {
        const item = snacks.find((s) => s.id === id);
        return item ? { snack: item, quantity } : null;
      })
      .filter((item): item is SelectedSnack => item !== null);

    // Actualizamos sessionData incorporando los snacks y el nuevo total
    const updatedSession = {
      ...sessionData,
      snacks: chosenSnacksList,
      totalPrice: grandTotal,
    };

    sessionStorage.setItem("checkout_selection", JSON.stringify(updatedSession));
    navigate("/checkout/payment");
  };

  if (loading || !sessionData) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-slate-400">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Cargando productos de confitería...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-[#e8e8ed] px-4 sm:px-8 py-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Volver a selección de sillas
          </button>
          <BackToHomeButton />
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Popcorn className="size-4" />
              <span>Confitería & Snacks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">¿Deseas acompañar tu película?</h1>
            <p className="text-xs text-slate-400 mt-1">
              Agrega combos o aperitivos antes de pasar a la pasarela de pago.
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="text-xs font-semibold text-slate-400 hover:text-purple-400 underline underline-offset-4 cursor-pointer self-start sm:self-center"
          >
            Omitir confitería e ir al pago →
          </button>
        </header>

        {/* Catálogo de Snacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {snacks.map((item) => {
            const qty = selectedSnacks[item.id] || 0;

            return (
              <div
                key={item.id}
                className="bg-[#111424] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition shadow-lg"
              >
                <div className="h-40 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-sm font-black text-purple-400 font-mono">
                      ${item.price.toLocaleString()} COP
                    </span>

                    <div className="flex items-center gap-2 bg-[#070913] border border-white/10 rounded-xl p-1">
                      {qty > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="size-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white font-mono">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdd(item.id)}
                            className="size-7 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <Plus className="size-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAdd(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="size-3.5" />
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra Inferior Flotante */}
      <aside className="fixed bottom-0 left-0 w-full bg-[#0b0f19]/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400">Total acumulado (Sillas + Snacks):</span>
            <p className="text-xl font-black text-white mt-0.5 font-mono">
              ${grandTotal.toLocaleString()} <span className="text-xs font-normal text-slate-400">COP</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            Continuar al Pago
            <ArrowRight className="size-4" />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SnacksSelectionView;