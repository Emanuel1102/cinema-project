import {
  cities,
  dateKey,
  movies,
  next7Days,
  type Movie,
  type Showtime,
} from "./data";

/** Función (screening) con ciudad, fecha y hora concretas. */
export type Screening = Showtime & {
  id: string;
  movieId: string;
  cityId: string;
  date: string;
  startsAt: string;
};

const PENDING_KEY = "riwi:pending-function";

function hash(text: string) {
  let h = 7;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 100003;
  return h;
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Complejos activos en una ciudad (las ciudades sin cines no tienen complejos). */
export function complexesForCity(cityId: string): string[] {
  const city = cities.find((c) => c.id === cityId);
  if (!city || !city.hasCinemas) return [];
  const base = hash(cityId);
  return [
    `Riwi Films ${city.name} Centro`,
    `Riwi Films ${city.name} Plaza`,
    ...(base % 2 === 0 ? [`Riwi Films ${city.name} Norte`] : []),
  ];
}

function buildScreenings(movie: Movie, cityId: string): Screening[] {
  const complexes = complexesForCity(cityId);
  if (complexes.length === 0) return [];

  return next7Days().flatMap((day) => {
    const date = dateKey(day);
    return movie.showtimes.flatMap((s, i) =>
      complexes.map((complex, ci) => {
        const seed = hash(`${movie.id}|${cityId}|${date}|${s.time}|${complex}`);
        const [h, m] = s.time.split(":");
        const startsAt = new Date(day);
        startsAt.setHours(Number(h), Number(m), 0, 0);
        return {
          ...s,
          complex,
          id: `${movie.id}-${cityId}-${date}-${s.time}-${ci}`,
          movieId: movie.id,
          cityId,
          date,
          startsAt: startsAt.toISOString(),
          seatsLeft: seed % 11 === 0 ? 0 : (seed % 78) + 2,
          price: s.price + ci * 1500 + (i % 2) * 1000,
        } satisfies Screening;
      }),
    );
  });
}

/** GET /movies/{id} */
export function fetchMovie(movieId: string): Promise<Movie> {
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return Promise.reject(new Error("Película no encontrada"));
  return delay(movie, 250);
}

/** GET /movies/{id}/functions */
export function fetchFunctions(movieId: string, cityId: string | null): Promise<Screening[]> {
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return Promise.reject(new Error("Película no encontrada"));
  if (!cityId) return delay([], 150);
  return delay(buildScreenings(movie, cityId), 450);
}

/** GET /movies/{id}/recommendations */
export function fetchRecommendations(movieId: string): Promise<Movie[]> {
  return delay(
    movies.filter((m) => m.id !== movieId).slice(0, 4),
    350,
  );
}

/** Solo funciones futuras respecto al momento actual. */
export function onlyUpcoming(list: Screening[], now = Date.now()) {
  return list.filter((s) => new Date(s.startsAt).getTime() > now);
}

export function savePendingScreening(screening: Screening) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(screening));
}

export function readPendingScreening(): Screening | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Screening) : null;
  } catch {
    return null;
  }
}
