import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import type { SelectedLocation } from "../interfaces/location";

type LocationFormProps = {
  onComplete?: (location: SelectedLocation) => void;
  onClose?: () => void;
};

type ApiCity = { id: string | number; name: string };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export function LocationForm({ onComplete, onClose }: LocationFormProps) {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [cities, setCities] = useState<ApiCity[]>([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch(`${API_BASE}/api/cities`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Error fetching cities");
        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : payload.cities || payload.data || [];
        if (!mounted) return;
        setCities(list);
        if (list.length > 0) {
          setSelectedCityId(String(list[0].id));
          setSelectedCityName(String(list[0].name));
        }
      })
      .catch(() => {
        if (!mounted) return;
        toast.error("No se pudo cargar la lista de ciudades.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function updateUserCity(cityId: string, cityName: string) {
    if (!user || !token) return;

    try {
      await fetch(`${API_BASE}/api/users/location`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cityId, cityName }),
      });
    } catch {
      // Ignoramos el error del backend para no bloquear la experiencia de la app.
    }
  }

  function handleVerCartelera() {
    if (!selectedCityId || !selectedCityName) {
      toast.error("Selecciona una ciudad para continuar.");
      return;
    }

    const selectedLocation: SelectedLocation = {
      city: selectedCityName,
      cityId: selectedCityId,
      cityName: selectedCityName,
    };

    const savedLocation = {
      cityId: selectedCityId,
      cityName: selectedCityName,
    };

    window.localStorage.setItem("riwi:location", JSON.stringify(savedLocation));
    if (user && token) {
      void updateUserCity(selectedCityId, selectedCityName);
    }

    if (onComplete) {
      onComplete(selectedLocation);
      return;
    }

    navigate("/movies", { state: { cityId: selectedCityId, city: selectedCityName } });
  }

  const selectClass =
    "w-full rounded-2xl border border-white/10 bg-[#0F172A]/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#818CF8] focus:ring-2 focus:ring-[#818CF8]/20 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400";

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/95 p-5 text-white backdrop-blur-sm">
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111827]/90 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl">
        <div className="grid min-h-[680px] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative hidden overflow-hidden bg-[#0F172A] p-8 lg:flex lg:flex-col lg:justify-end">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.45),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(219,39,119,0.28),transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.85),rgba(15,23,42,0.35))]" />

            <div className="relative z-10 max-w-md">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#818CF8]">Multicine</p>
              <h1 className="text-4xl font-black leading-tight text-white">¿Dónde quieres ver cine?</h1>
              <p className="mt-4 text-base text-slate-300">Elige tu ciudad para ver la cartelera disponible más cercana a ti.</p>
            </div>
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#818CF8]">Ubicación</p>
                <h2 className="mt-2 text-3xl font-black text-white">Selecciona tu ciudad</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED] text-lg font-bold text-white shadow-lg shadow-[#7C3AED]/30">M</div>
            </div>

            {onClose && (
              <button onClick={onClose} aria-label="Cerrar selector de ubicación" className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                Cerrar
              </button>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#818CF8]">Ciudad</label>
                <select
                  name="city"
                  id="city"
                  value={selectedCityId}
                  onChange={(event) => {
                    const cityId = event.target.value;
                    const cityFound = cities.find((city) => String(city.id) === cityId);
                    setSelectedCityId(cityId);
                    setSelectedCityName(cityFound ? String(cityFound.name) : "");
                  }}
                  disabled={loading || cities.length === 0}
                  className={selectClass}
                >
                  {cities.length === 0 ? (
                    <option value="">{loading ? "Cargando ciudades..." : "Sin ciudades disponibles"}</option>
                  ) : (
                    cities.map((city) => (
                      <option key={String(city.id)} value={String(city.id)}>
                        {city.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button
                onClick={handleVerCartelera}
                disabled={!selectedCityId || !selectedCityName || loading}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#818CF8] to-[#DB2777] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#7C3AED]/25 transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                Ver cartelera
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
