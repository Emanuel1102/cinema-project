import React, { useEffect, useState, useMemo } from 'react';
import type { UpcomingMovie } from '../interfaces/upcoming.interface';
import { getUpcomingMovies, subscribeToUpcomingNotification } from '../services/upcomingServices';
import { CountdownTimer } from '../components/CountdownTimer';
import { BackToHomeButton } from '@/shared/components';

export const UpcomingPage: React.FC = () => {
  const [movies, setMovies] = useState<UpcomingMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');

  useEffect(() => {
    getUpcomingMovies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genres?.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (selectedGenre === 'ALL') return movies;
    return movies.filter((m) => m.genres?.includes(selectedGenre));
  }, [movies, selectedGenre]);

  const handleNotify = async (movieId: string) => {
    await subscribeToUpcomingNotification(movieId);
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, isNotified: true } : m))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        Cargando próximos estrenos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Cabecera con título y filtro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Próximamente
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Activa notificaciones y recibe un aviso cuando llegue a la cartelera de tu ciudad.
            </p>
          </div>
          <BackToHomeButton />

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-[#151c2c] text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de películas */}
        <div className="space-y-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#151c2c] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row h-full md:h-64 hover:border-slate-700 transition-all duration-300"
            >
              <div className="relative md:w-80 h-56 md:h-full shrink-0 bg-slate-900">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <CountdownTimer targetDate={movie.releaseDate} />
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {movie.genres?.map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 text-purple-300 border border-purple-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {movie.title}
                  </h2>
                  
                  <p className="text-slate-300 text-sm line-clamp-3 h-14 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <div>
                    <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Estreno Estimado
                    </span>
                    <span className="text-sm font-medium text-slate-200">
                      {movie.releaseDate}
                    </span>
                  </div>

                  <button
                    disabled={movie.isNotified}
                    onClick={() => handleNotify(movie.id)}
                    className={`px-5 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
                      movie.isNotified
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'
                    }`}
                  >
                    {movie.isNotified ? '✓ Notificación Activada' : '🔔 Notificarme'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
