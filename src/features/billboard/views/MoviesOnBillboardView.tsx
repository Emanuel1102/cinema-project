import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { type Movie } from "@/lib/data";
import { fetchMoviesByCity } from "@/lib/movies-api";
import { useAuth, useLocation as useSavedLocation } from "@/lib/store";
import { MovieHero } from "@/features/billboard/components/MovieItems/MovieHero";
import { TrailerModal } from "@/features/billboard/components/MovieItems/TrailerModal";

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
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

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

    setActiveTrailerMovie(movie);
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-slate-100">
      <div className="relative overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#7C3AED]/25 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-[#818CF8]/20 blur-3xl pointer-events-none" />

        {/* Hero Section Carousel */}
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          {loading ? (
            <div className="h-[420px] animate-pulse rounded-[32px] bg-slate-800/80" />
          ) : (
            <MovieHero
              movies={movies}
              onTrailer={handleTrailer}
              onReserve={handleReserve}
            />
          )}
        </section>

        {/* Trailer Modal */}
        {activeTrailerMovie && (
          <TrailerModal
            title={activeTrailerMovie.title}
            trailerId={activeTrailerMovie.trailerId}
            onClose={() => setActiveTrailerMovie(null)}
          />
        )}

        {/* Billboard Grid Section */}
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
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
                    
                    {/* Quick Trailer Button Overlay */}
                    <button
                      onClick={() => handleTrailer(movie)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100"
                    >
                      <span className="rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition hover:scale-110">
                        ▶
                      </span>
                    </button>
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

