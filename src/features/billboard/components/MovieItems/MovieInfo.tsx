import { formatCOP, type Movie } from "@/lib/data";

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

export function MovieInfo({ movie, prices }: { movie: Movie; prices: number[] }) {
  const priceLabel = prices.length
    ? `${formatCOP(Math.min(...prices))} – ${formatCOP(Math.max(...prices))}`
    : "Sin funciones disponibles";

  return (
    <div className="surface-panel p-5">
      <h2 className="text-lg font-bold">Información general</h2>
      <p className="mt-2 text-sm text-muted-foreground">{movie.synopsis}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Info label="Director" value={movie.director} />
        <Info label="Fecha de estreno" value={movie.releaseDate} />
        <Info label="Duración" value={`${movie.duration} minutos`} />
        <Info label="Clasificación" value={movie.rating} />
        <Info label="Idiomas" value={movie.languages.join(", ")} />
        <Info label="Formatos" value={movie.formats.join(", ")} />
        <Info label="Géneros" value={movie.genres.join(", ")} />
        <Info label="Calificación promedio" value={`${movie.score.toFixed(1)} / 5`} />
        <Info label="Precios" value={priceLabel} />
      </dl>
    </div>
  );
}
