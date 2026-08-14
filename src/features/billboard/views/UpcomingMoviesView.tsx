export function UpcomingMoviesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-white/10 bg-[#111827] p-8 shadow-[0_25px_80px_rgba(15,23,42,0.7)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#818CF8]">
          Próximamente
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Nuevos estrenos en camino
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Pronto llegará la próxima tanda de películas, premieres especiales y funciones exclusivas.
        </p>
      </section>
    </main>
  );
}
