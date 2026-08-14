import { Link } from "react-router";
import { Star } from "lucide-react";
import type { Movie } from "@/lib/data";

export function Recommendations({ movies, loading }: { movies: Movie[]; loading: boolean }) {
  return (
    <section className="surface-panel p-5">
      <h2 className="text-lg font-bold">También te puede gustar</h2>
      {loading ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((m) => (
            <Link
              key={m.id}
              to={`/movies/${m.id}`}
              className="group rounded-xl p-2 transition hover:bg-secondary"
            >
              <img
                src={m.poster}
                alt={`Póster de ${m.title}`}
                loading="lazy"
                width={683}
                height={1024}
                className="aspect-[2/3] w-full rounded-lg object-cover"
              />
              <p className="mt-2 text-sm font-semibold">{m.title}</p>
              <p className="text-xs text-muted-foreground">{m.genres.join(" · ")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                <Star className="mr-1 inline size-3 text-accent" />
                {m.score.toFixed(1)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
