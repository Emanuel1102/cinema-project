import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Ticket } from "lucide-react";
import { toast } from "sonner";
import { cities, dateKey, formatCOP, next7Days, type Movie } from "@/lib/data";
import {
  fetchFunctions,
  fetchMovie,
  fetchRecommendations,
  onlyUpcoming,
  savePendingScreening,
  type Screening,
} from "@/lib/movies-api";
import { useAuth, useLocation, useReservations } from "@/lib/store";
import { MovieHero } from "@/features/billboard/components/MovieItems/MovieHero";
import { TrailerModal } from "@/features/billboard/components/MovieItems/TrailerModal";
import { MovieInfo } from "@/features/billboard/components/MovieItems/MovieInfo";
import { CastList } from "@/features/billboard/components/MovieItems/CastList";
import { ShowtimeFilters } from "@/features/billboard/components/MovieItems/ShowtimeFilters";
import { ShowtimeList } from "@/features/billboard/components/MovieItems/ShowtimeList";
import { Recommendations } from "@/features/billboard/components/MovieItems/Recommendations";

export default function MovieDetails() {
  // Obtenemos el movieId de los parámetros de la URL sin requerir la definición estricta de la ruta
  const { movieId } = useParams() as { movieId: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useReservations();
  const { location } = useLocation();

  const days = useMemo(() => next7Days(), []);
  const cityOptions = useMemo(() => cities.filter((c) => c.hasCinemas), []);

  const [cityId, setCityId] = useState(() => location?.cityId ?? "");
  const [selectedDay, setSelectedDay] = useState(() => dateKey(days[0]!));
  const [format, setFormat] = useState("");
  const [selected, setSelected] = useState<Screening | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Estados manuales para reemplazar React Query
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [isMovieError, setIsMovieError] = useState(false);

  const [functions, setFunctions] = useState<Screening[]>([]);
  const [isFunctionsLoading, setIsFunctionsLoading] = useState(false);
  const [isFunctionsError, setIsFunctionsError] = useState(false);

  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);

  // Cargar detalles de la película con promesas simples (.then)
  useEffect(() => {
    if (!movieId) return;
    fetchMovie(movieId)
      .then((data) => {
        setMovie(data);
        setIsMovieLoading(false);
        // Autoseleccionar el primer formato disponible
        if (data && data.formats && data.formats.length > 0) {
          setFormat(data.formats[0]);
        }
      })
      .catch(() => {
        setIsMovieError(true);
        setIsMovieLoading(false);
      });
  }, [movieId]);

  // Cargar funciones de la película
  useEffect(() => {
    if (!movieId) return;

    fetchFunctions(movieId, cityId || null)
      .then((data) => {
        setFunctions(data);
        setIsFunctionsLoading(false);
      })
      .catch(() => {
        setIsFunctionsError(true);
        setIsFunctionsLoading(false);
      });
  }, [movieId, cityId]);

  // Cargar recomendaciones
  useEffect(() => {
    if (!movieId) return;
    fetchRecommendations(movieId)
      .then((data) => {
        setRecommendations(data);
        setIsRecommendationsLoading(false);
      })
      .catch(() => {
        setIsRecommendationsLoading(false);
      });
  }, [movieId]);

  const upcoming = useMemo(
    () => onlyUpcoming(functions ?? []),
    [functions],
  );

  const visible = useMemo(
    () => upcoming.filter((s) => s.date === selectedDay && (!format || s.format === format)),
    [upcoming, selectedDay, format],
  );

  const selectedScreening = selected && visible.some((screening) => screening.id === selected.id)
    ? selected
    : null;

  function startCheckout() {
    if (!selectedScreening) {
      toast.error("Selecciona un horario disponible");
      return;
    }
    if (!user) {
      toast.error("Inicia sesión para reservar una función");
      navigate("/login");
      return;
    }
    if (!movie) return;

    savePendingScreening(selectedScreening);
    add({
      movieId: movie.id,
      movieTitle: movie.title,
      date: selectedScreening.date,
      time: selectedScreening.time,
      format: selectedScreening.format,
      complex: selectedScreening.complex,
      seats: 1,
      total: selectedScreening.price,
    });
    toast.success("Reserva simulada guardada correctamente.");
  }

  if (isMovieLoading) {
    return (
      <main className="mx-auto max-w-7xl space-y-6 p-4" aria-busy="true">
        <div className="h-[300px] animate-pulse rounded-2xl bg-secondary" />
        <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
        <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
      </main>
    );
  }

  if (isMovieError || !movie) {
    return (
      <main role="alert" className="mx-auto max-w-3xl p-10 text-center">
        <h1 className="text-xl font-bold">No pudimos cargar la película</h1>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4 px-4 py-2 text-sm">
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main>
      <MovieHero movie={movie} onTrailer={() => setShowTrailer(true)} />

      {showTrailer && (
        <TrailerModal
          title={movie.title}
          trailerId={movie.trailerId}
          onClose={() => setShowTrailer(false)}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <MovieInfo movie={movie} prices={upcoming.map((s) => s.price)} />
            <CastList cast={movie.cast} />
          </div>

          <section className="surface-panel h-fit p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Calendar className="size-4 text-accent" /> Funciones
            </h2>

            <div className="mt-4">
              <ShowtimeFilters
                days={days}
                selectedDay={selectedDay}
                onDay={setSelectedDay}
                formats={movie.formats}
                format={format}
                onFormat={setFormat}
                cityOptions={cityOptions}
                cityId={cityId}
                onCity={setCityId}
              />
            </div>

            {!cityId ? (
              <p className="mt-4 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                Selecciona una ciudad para ver las funciones disponibles.
              </p>
            ) : isFunctionsError ? (
              <div role="alert" className="mt-4 text-sm">
                <p>No pudimos cargar las funciones.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary mt-2 px-3 py-1.5 text-xs"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <ShowtimeList
                functions={visible}
                loading={isFunctionsLoading}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            )}

            <div className="mt-5 border-t border-border pt-4">
              {selectedScreening && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {selectedScreening.complex} · {selectedScreening.date} · {selectedScreening.time} · {selectedScreening.format} ·{" "}
                  {formatCOP(selectedScreening.price)}
                </p>
              )}
              <button
                onClick={startCheckout}
                disabled={!selectedScreening}
                className="btn-primary flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Ticket className="size-4" /> Iniciar compra
              </button>
            </div>
          </section>
        </div>

        <Recommendations
          movies={recommendations}
          loading={isRecommendationsLoading}
        />
      </div>
    </main>
  );
}
