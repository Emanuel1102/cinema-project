export const Footer = () => {
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
          <button className="transition-colors hover:text-[#818CF8]">Cartelera</button>
          <button className="transition-colors hover:text-[#818CF8]">Próximamente</button>
          <button className="transition-colors hover:text-[#818CF8]">Mi Cuenta</button>
          <button className="transition-colors hover:text-[#818CF8]">Bonos de Regalo</button>
          <button className="transition-colors hover:text-[#818CF8]">PQRS</button>
          <button className="transition-colors hover:text-[#818CF8]">Términos</button>
        </div>

        <p className="text-xs text-slate-400">© 2025 Multicine · API v1.0</p>
      </div>
    </footer>
  );
};
