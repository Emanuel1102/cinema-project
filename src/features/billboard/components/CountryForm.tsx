import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCountries, getDepartments, getCities, FALLBACK } from "../services/locationService";
import type { SelectedLocation } from "../interfaces/location";

const formatLabel = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

export function LocationForm() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<string[]>(FALLBACK.countries);
  const [departaments, setDepartaments] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [country, setCountry] = useState<string>(FALLBACK.countries[0]);
  const [departament, setDepartament] = useState<string>("");
  const [city, setCity] = useState<string>("");

  // loading/error states omitted (not needed for now)

  useEffect(() => {
    let mounted = true;
    getCountries()
      .then((list) => mounted && setCountries(list))
      .catch(() => {
        // fallback already set
      })
      .finally(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!country) return;
    getDepartments(country)
      .then((list) => {
        if (!mounted) return;
        setDepartaments(list.length ? list : FALLBACK.departamentsByCountry[country] || []);
      })
      .catch(() => {
        setDepartaments(FALLBACK.departamentsByCountry[country] || []);
      })
      .finally(() => {});

    return () => {
      mounted = false;
    };
  }, [country]);

  useEffect(() => {
    let mounted = true;
    if (!departament) return;
    getCities(departament)
      .then((list) => {
        if (!mounted) return;
        setCities(list.length ? list : FALLBACK.citiesByDepartament[departament] || []);
      })
      .catch(() => {
        setCities(FALLBACK.citiesByDepartament[departament] || []);
      })
      .finally(() => {});

    return () => {
      mounted = false;
    };
  }, [departament]);

  function handleCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCountry(event.target.value);
    setDepartament("");
    setCity("");
    setCities([]);
  }

  function handleDepartamentChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDepartament(event.target.value);
    setCity("");
    setCities([]);
  }

  function handleCityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCity(event.target.value);
  }

  function handleVerCartelera() {
    if (!city) return;
    const selectedLocation: SelectedLocation = { country, departament, city };
    try {
      window.localStorage.setItem("cinemaSelectedLocation", JSON.stringify(selectedLocation));
    } catch {
      /* ignore */
    }
    navigate("/movies", { state: selectedLocation });
  }

  const selectClass =
    "w-full rounded-2xl border border-white/10 bg-[#0F172A]/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#818CF8] focus:ring-2 focus:ring-[#818CF8]/20 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A] p-5 text-white">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111827]/90 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl">
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

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="countries" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#818CF8]">País</label>
                <select name="countries" id="countries" value={country} onChange={handleCountryChange} className={selectClass}>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {formatLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="departament" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#818CF8]">Departamento</label>
                <select name="departament" id="departament" value={departament} onChange={handleDepartamentChange} className={selectClass}>
                  <option value="">Selecciona uno...</option>
                  {departaments.map((depart) => (
                    <option key={depart} value={depart}>
                      {formatLabel(depart)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#818CF8]">Ciudad</label>
                <select name="city" id="city" value={city} onChange={handleCityChange} disabled={!departament} className={selectClass}>
                  <option value="">Selecciona una ciudad...</option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {formatLabel(cityName)}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleVerCartelera} disabled={!city} className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#818CF8] to-[#DB2777] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#7C3AED]/25 transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none">Ver cartelera</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



