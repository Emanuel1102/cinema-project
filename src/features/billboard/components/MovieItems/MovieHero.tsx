import { Play, Star, Clock } from "lucide-react";
import type { Movie } from "@/lib/data";
import bannerImg from "@/assets/hero.png";

export function MovieHero({ movie, onTrailer }: { movie: Movie; onTrailer: () => void }) {
  return (
    <section className="relative">
      <img
        src={bannerImg}
        alt=""
        width={1600}
        height={700}
        className="h-[240px] w-full object-cover opacity-40 sm:h-[320px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="relative mx-auto -mt-28 max-w-7xl px-4 sm:-mt-36">
        <div className="flex flex-col gap-6 sm:flex-row">
          <img
            src={movie.poster}
            alt={`Póster de ${movie.title}`}
            width={683}
            height={1024}
            className="w-40 shrink-0 rounded-xl object-cover shadow-card sm:w-56"
          />
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {movie.premiere && <span className="chip-accent">Estreno</span>}
              <span className="chip">
                <Star className="size-3 text-accent" /> {movie.score.toFixed(1)} promedio
              </span>
              <span className="chip">{movie.rating}</span>
              <span className="chip">
                <Clock className="size-3" /> {movie.duration} min
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{movie.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{movie.genres.join(" · ")}</p>
            <p className="mt-3 max-w-2xl text-sm">{movie.synopsis}</p>
            <button
              onClick={onTrailer}
              className="btn-primary mt-4 inline-flex items-center gap-2 px-5 py-2 text-sm"
            >
              <Play className="size-4" /> Ver tráiler
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
