import { useState } from "react";
import { useNavigate } from "react-router"; //  Importar hook de navegación

// ... (Tus constantes DEPARTAMENTS_BY_COUNTRY y CITY_BY_DEPARTAMENTS se mantienen igual) ...
const DEPARTAMENTS_BY_COUNTRY: Record<string, string[]> = {
  colombia: ["choco", "atlantico", "cordoba"],
  peru: ["cusco", "lima", "ucayali"],
};

const CITY_BY_DEPARTAMENTS: Record<string, string[]> = {
  choco: ["quibdo", "istmina", "condoto"],
  atlantico: ["barranquilla", "soledad", "sabanalarga"],
  cordoba: ["monteria", "lorica", "sahagun"],
  cusco: ["cusco", "pisac", "ollantaytambo"],
  lima: ["lima", "miraflores", "barranco"],
  ucayali: ["pucallpa", "atalaya", "purus"],
};

export function LocationForm() {
  const navigate = useNavigate(); //  Inicializar navigate
  const [country, setCountry] = useState("colombia");
  const [departament, setDepartament] = useState("");
  const [city, setCity] = useState("");

  const currentDepartaments = DEPARTAMENTS_BY_COUNTRY[country] || [];
  const currentCities = CITY_BY_DEPARTAMENTS[departament] || [];

  function handleCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCountry(event.target.value);
    setDepartament("");
    setCity("");
  }

  function handleDepartamentChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDepartament(event.target.value);
    setCity("");
  }

  function handleCityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCity(event.target.value);
  }

  // Función para manejar el click y navegar
  function handleVerCartelera() {
    if (!city) return;

    // Navega a '/movies' pasando los datos en el estado
    navigate("/movies", { 
      state: { 
        country, 
        departament, 
        city 
      } 
    });
  }

  const selectClass =
    "w-full bg-white border border-[#A476FF]/50 rounded-md px-3 py-2.5 text-sm text-[#0B1326] focus:outline-none focus:border-[#732EE4] focus:ring-2 focus:ring-[#732EE4]/30 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 bg-[#0B1326]/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#F4EEFF] border border-[#D2BBFF] rounded-xl overflow-hidden shadow-2xl">
        
        {/* ... (Todo el JSX del header y los selects se mantiene IGUAL) ... */}
        <div className="h-32 bg-[#732EE4] relative">
          <div className="absolute top-4 left-4 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md">
            📍
          </div>
          <p className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">
            ¿Dónde quieres ir al cine?
          </p>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-[#732EE4] text-center -mt-1 font-medium">
            Selecciona tu ubicación para ver la cartelera disponible
          </p>

          <div className="space-y-1.5">
            <label htmlFor="countries" className="block text-[11px] tracking-wide text-[#3F008E] font-semibold">
              PAÍS
            </label>
            <select
              name="countries"
              id="countries"
              value={country}
              onChange={handleCountryChange}
              className={selectClass}
            >
              <option value="colombia">Colombia</option>
              <option value="peru">Perú</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="departament" className="block text-[11px] tracking-wide text-[#3F008E] font-semibold">
              DEPARTAMENTO / ESTADO
            </label>
            <select
              name="departament"
              id="departament"
              value={departament}
              onChange={handleDepartamentChange}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              {currentDepartaments.map((depart) => (
                <option key={depart} value={depart}>
                  {depart.charAt(0).toUpperCase() + depart.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="city" className="block text-[11px] tracking-wide text-[#3F008E] font-semibold">
              CIUDAD
            </label>
            <select
              name="city"
              id="city"
              value={city}
              onChange={handleCityChange}
              disabled={!departament}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              {currentCities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Agregar el onClick al botón */}
          <button
            onClick={handleVerCartelera} 
            disabled={!city}
            className="w-full text-sm font-semibold tracking-wide py-3 rounded-md transition
              bg-[#732EE4] hover:bg-[#8D4FFF] text-white
              disabled:bg-[#D2BBFF] disabled:text-[#732EE4] disabled:cursor-not-allowed"
          >
            VER CARTELERA
          </button>
        </div>
      </div>
    </div>
  );
}   