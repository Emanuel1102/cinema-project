export const MovieOnBillboad = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-[0_12px_36px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#818CF8]/40 hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)]">
      <div className="relative overflow-hidden">
        <img
          alt="titulo de la pelicula aqui"
          className="h-72 w-full object-cover"
          src="https://images.unsplash.com/photo-1593538573197-4e3ee8a864d0?w=400&h=600&fit=crop&auto=format"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />
        <div className="absolute left-2 top-2 rounded-full bg-[#DB2777] px-2 py-1 text-[10px] font-bold text-white shadow-md">
          FLASH
        </div>
        <div className="absolute right-2 top-2 rounded-full border border-white/15 bg-[#0F172A]/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          PG-13
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div>
          <h3 className="text-base font-bold text-white">Titulo</h3>
          <p className="mt-1 text-xs text-slate-400">Genero · duracion min</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/15 px-2 py-1 text-[10px] font-semibold text-[#818CF8]">
            VIP
          </span>
          <span className="rounded-full border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300">
            Doblada
          </span>
        </div>

        <div className="mt-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Hoy 27 Jul</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
              13:00
            </button>
            <button className="rounded-lg bg-[#818CF8] px-2.5 py-1 text-xs font-semibold text-[#0F172A]">
              16:30
            </button>
            <button className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
              19:00
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700">
            Ver detalle
          </button>
          <button className="flex-1 rounded-xl bg-[#7C3AED] py-2 text-xs font-bold text-white hover:opacity-90">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};
