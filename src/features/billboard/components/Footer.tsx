import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

export const Footer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleAccount() {
    if (!user) {
      toast.info("Inicia sesión para ver tu cuenta.");
      navigate("/login");
      return;
    }
    navigate("/movies/profile");
  }

  function handleInfo(message: string) {
    toast.info(message);
  }

  return (
    <footer className="border-t border-white/10 bg-[#0F172A]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="2" width="8" height="8" rx="1.5"></rect>
              <rect x="14" y="2" width="8" height="8" rx="1.5"></rect>
              <rect x="2" y="14" width="8" height="8" rx="1.5"></rect>
              <rect x="14" y="14" width="8" height="8" rx="1.5"></rect>
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-100">MULTICINE</span>
        </div>

        <div className="flex gap-6 text-xs text-slate-400">
          <button onClick={() => navigate("/movies")} className="transition-colors hover:text-[#818CF8]">Cartelera</button>
          <button onClick={() => navigate("/movies/upcoming")} className="transition-colors hover:text-[#818CF8]">Próximamente</button>
          <button onClick={handleAccount} className="transition-colors hover:text-[#818CF8]">Mi Cuenta</button>
          <button onClick={() => handleInfo("Los bonos de regalo estarán disponibles próximamente.")} className="transition-colors hover:text-[#818CF8]">Bonos de Regalo</button>
          <button onClick={() => handleInfo("Puedes enviarnos tus PQRS cuando el servicio esté disponible.")} className="transition-colors hover:text-[#818CF8]">PQRS</button>
          <button onClick={() => handleInfo("Los términos estarán disponibles próximamente.")} className="transition-colors hover:text-[#818CF8]">Términos</button>
        </div>

        <p className="text-xs text-slate-400">© 2025 Multicine · API v1.0</p>
      </div>
    </footer>
  );
};
