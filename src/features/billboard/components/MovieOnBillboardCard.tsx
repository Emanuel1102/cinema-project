import { Link } from "react-router";
import { type Movie } from "@/lib/data";

interface MovieOnBillboardProps {
  movie: Movie;
  onReserve: (movie: Movie) => void;
}

export const MovieOnBillboad = ({ movie, onReserve }: MovieOnBillboardProps) => {
  return (
    <article className="flex flex-col h-full overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-[0_12px_36px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#818CF8]/40 hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)]">
      
      {/* Contenedor de la imagen con proporción fija para que todas midan igual */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          alt={`Póster de ${movie.title}`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={movie.poster}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />
        <div className="absolute left-2 top-2 rounded-full bg-[#DB2777] px-2 py-1 text-[10px] font-bold text-white shadow-md">
          {movie.score.toFixed(1)}
        </div>
        {movie.premiere && (
          <div className="absolute right-2 top-2 rounded-full border border-white/15 bg-[#0F172A]/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            Estreno
          </div>
        )}
      </div>

      {/* Contenedor principal con flex-1 y justify-between para asegurar simetría en altura */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white line-clamp-2 min-h-[48px] flex items-center">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1">
            {movie.genres.join(" • ")} · {movie.duration} min
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {movie.formats.slice(0, 2).map((format) => (
            <span
              key={format}
              className="rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/15 px-2 py-1 text-[10px] font-semibold text-[#818CF8]"
            >
              {format}
            </span>
          ))}
          <span className="rounded-full border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300">
            {movie.showtimes[0]?.audio}
          </span>
        </div>

        <div className="mt-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Horarios</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {movie.showtimes.slice(0, 3).map((showtime, index) => (
              <span
                key={showtime.time}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  index === 1
                    ? "bg-[#818CF8] text-[#0F172A]"
                    : "border border-white/10 bg-slate-800 text-slate-200"
                }`}
              >
                {showtime.time}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2 pt-2 border-t border-white/5">
          <Link
            to={`/movies/details/${movie.id}`}
            className="flex-1 text-center rounded-xl border border-white/10 bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            Ver detalle
          </Link>
          <button
            onClick={() => onReserve(movie)}
            className="flex-1 rounded-xl bg-[#7C3AED] py-2 text-xs font-bold text-white hover:opacity-90 transition"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
};

