import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { type Movie } from "@/lib/data";
import { fetchMoviesByCity } from "@/lib/movies-api";
import { useAuth, useLocation as useSavedLocation } from "@/lib/store";

export const MoviesOnBillboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location: savedLocation } = useSavedLocation();

  const selectedCityId =
    (location.state as { cityId?: string } | null)?.cityId || savedLocation?.cityId || "bogota";
  const cityLabel =
    (location.state as { city?: string } | null)?.city || savedLocation?.cityName || "Bogotá";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchMoviesByCity(selectedCityId)
      .then((items) => {
        if (active) setMovies(items);
      })
      .catch(() => {
        if (active) setMovies([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCityId]);

  function handleReserve(movie: Movie) {
    if (!user) {
      toast.error("Inicia sesión para reservar una función.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    navigate(`/movies/details/${movie.id}`);
  }

  function handleTrailer(movie: Movie) {
    if (!movie.trailerId) {
      toast.info("Este título no tiene tráiler disponible.");
      return;
    }

    window.open(`https://www.youtube.com/watch?v=${movie.trailerId}`, "_blank", "noopener,noreferrer");
  }

  const featuredMovie = movies[0] ?? null;

  return (
    <div className="min-h-screen bg-[#0b1326] text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#7C3AED]/25 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-[#818CF8]/20 blur-3xl" />

        {loading && (
          <div className="mx-auto max-w-7xl px-4 pt-10">
            <div className="h-64 animate-pulse rounded-[32px] bg-slate-800/80" />
          </div>
        )}

        {!loading && featuredMovie && (
          <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111827] shadow-[0_25px_80px_rgba(15,23,42,0.7)]">
              <img src={featuredMovie.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1326]/90 via-[#0b1326]/60 to-[#0b1326]/35" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b1326] to-transparent" />

              <div className="relative z-10 flex min-h-[480px] items-end px-6 py-8 sm:px-8 lg:px-12">
                <div className="max-w-2xl">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c4b5fd]">
                    <span className="rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 px-3 py-1.5">{featuredMovie.premiere ? "Estreno" : "Destacada"}</span>
                    <span className="inline-flex items-center gap-1.5 text-[#f8fafc]"><span className="text-[#fbbf24]">★</span> {featuredMovie.score.toFixed(1)}</span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{featuredMovie.title}</h1>
                  <p className="mt-4 max-w-lg text-base text-slate-300 sm:text-lg">{featuredMovie.synopsis}</p>
                  <div className="mt-7 flex flex-wrap gap-4">
                    <button onClick={() => handleTrailer(featuredMovie)} className="rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#818CF8] to-[#DB2777] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#7C3AED]/25 transition duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95">Ver tráiler</button>
                    <button onClick={() => handleReserve(featuredMovie)} className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-100 transition duration-200 hover:bg-white/10 hover:scale-[1.02] active:scale-95">Reservar</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#818CF8]">En cartelera</p>
              <h2 className="mt-2 text-3xl font-black text-white">Cartelera en {cityLabel}</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="h-80 animate-pulse rounded-[22px] bg-slate-800/80" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {movies.map((movie) => (
                <article key={movie.id} className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-[0_16px_40px_rgba(15,23,42,0.55)] transition duration-200 hover:-translate-y-1 hover:border-[#818CF8]/40">
                  <div className="relative overflow-hidden">
                    <img src={movie.poster} alt={`Póster de ${movie.title}`} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 rounded-full bg-[#DB2777] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">{movie.score.toFixed(1)}</div>
                  </div>
                  <div className="space-y-4 p-4">
                    <div><h3 className="text-lg font-bold text-white">{movie.title}</h3><p className="mt-1 text-xs text-slate-400">{movie.genres.join(" • ")} · {movie.duration} min</p></div>
                    <div className="flex flex-wrap gap-2">
                      {movie.formats.slice(0, 2).map((format) => <span key={format} className="rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c4b5fd]">{format}</span>)}
                      <span className="rounded-full border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300">{movie.showtimes[0]?.audio}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movie.showtimes.slice(0, 3).map((showtime) => <span key={showtime.time} className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200">{showtime.time}</span>)}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Link to={`/movies/details/${movie.id}`} className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-center text-xs font-bold text-slate-200 transition duration-200 hover:bg-slate-700 hover:scale-[1.02] active:scale-95">Ver detalle</Link>
                      <button onClick={() => handleReserve(movie)} className="flex-1 rounded-xl bg-[#7C3AED] px-3 py-2 text-xs font-bold text-white transition duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95">Reservar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
