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
import { SeatItem } from "@/features/billboard/components/SeatMap/SeatItem";
import { SeatLegend } from "@/features/billboard/components/SeatMap/SeatLegend";
import { useSeatSelection } from "@/features/billboard/utils/useSeatSelection";
import { BackToHomeButton } from "@/shared/components";

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
  const seatSelection = useSeatSelection(selectedScreening?.id ?? "");

  async function startCheckout() {
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
    if (seatSelection.selectedSeatIds.length === 0) {
      toast.error("Selecciona al menos una silla");
      return;
    }

    const locked = await seatSelection.handleLockSeats();
    if (!locked) {
      toast.error(seatSelection.error ?? "No pudimos reservar las sillas");
      return;
    }

    savePendingScreening(selectedScreening);
    add({
      movieId: movie.id,
      movieTitle: movie.title,
      date: selectedScreening.date,
      time: selectedScreening.time,
      format: selectedScreening.format,
      complex: selectedScreening.complex,
      seats: seatSelection.selectedSeatIds.length,
      total: seatSelection.totalPrice,
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
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <BackToHomeButton />
      </div>
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

            {selectedScreening && (
              <section className="mt-6 border-t border-border pt-5" aria-labelledby="seat-selection-title">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 id="seat-selection-title" className="text-lg font-bold">Selecciona tus sillas</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {seatSelection.isLoading ? "Cargando mapa..." : `${seatSelection.selectedSeatIds.length} seleccionada(s)`}
                    </p>
                  </div>
                  {seatSelection.totalPrice > 0 && (
                    <span className="chip-accent">{formatCOP(seatSelection.totalPrice)}</span>
                  )}
                </div>

                {seatSelection.error ? (
                  <p role="alert" className="mt-4 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                    {seatSelection.error}
                  </p>
                ) : seatSelection.isLoading ? (
                  <div className="mt-4 h-48 animate-pulse rounded-xl bg-secondary" aria-busy="true" />
                ) : seatSelection.seats.length === 0 ? (
                  <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                    No hay mapa de sillas disponible para esta función.
                  </p>
                ) : (
                  <>
                    <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-background/40 p-4">
                      <div className="mx-auto mb-5 max-w-md rounded-full border border-accent/50 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                        Pantalla
                      </div>
                      <div className="mx-auto w-max space-y-2">
                        {[...new Set(seatSelection.seats.map((seat) => seat.row))].map((row) => (
                          <div key={row} className="flex items-center gap-2">
                            <span className="w-5 text-center text-xs font-bold text-muted-foreground">{row}</span>
                            <div className="flex gap-2">
                              {seatSelection.seats
                                .filter((seat) => seat.row === row)
                                .sort((a, b) => a.number - b.number)
                                .map((seat) => (
                                  <SeatItem
                                    key={seat.id}
                                    seat={seat}
                                    isSelected={seatSelection.selectedSeatIds.includes(seat.id)}
                                    onSelect={seatSelection.toggleSeatSelection}
                                  />
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <SeatLegend className="mt-4" />
                  </>
                )}
              </section>
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
