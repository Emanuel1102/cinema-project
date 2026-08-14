import { Link, useLocation } from "react-router";

const formatLocationLabel = (value: string) => {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const Header = () => {
  const location = useLocation();

  const cityLabel = (() => {
    const stateCity = (location.state as { city?: string } | null)?.city;
    if (stateCity) return formatLocationLabel(stateCity);

    if (typeof window !== "undefined") {
      const savedLocation = window.localStorage.getItem("cinemaSelectedLocation");
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation) as { city?: string };
          if (parsedLocation.city) {
            return formatLocationLabel(parsedLocation.city);
          }
        } catch {
          return "Bogotá";
        }
      }
    }

    return "Bogotá";
  })();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0F172A]/85 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.5)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="2" width="8" height="8" rx="1.5"></rect>
              <rect x="14" y="2" width="8" height="8" rx="1.5"></rect>
              <rect x="2" y="14" width="8" height="8" rx="1.5"></rect>
              <rect x="14" y="14" width="8" height="8" rx="1.5"></rect>
            </svg>
          </div>
          <span className="hidden text-sm font-black uppercase tracking-[0.18em] text-white sm:block">MULTICINE</span>
        </div>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link to="/movies" className="rounded-lg bg-[#7C3AED]/15 px-3 py-1.5 text-[#818CF8] transition-colors hover:bg-[#7C3AED]/20">
            Cartelera
          </Link>
          <Link to="/movies/upcoming" className="rounded-lg px-3 py-1.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            Próximamente
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 sm:flex">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {cityLabel}
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-200 hover:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>

          <Link to="/login" className="rounded-xl bg-[#7C3AED] px-4 py-1.5 text-sm font-semibold text-white transition-all hover:opacity-90">
            Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
};
