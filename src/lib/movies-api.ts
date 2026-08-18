import {
  cities,
  dateKey,
  movies,
  next7Days,
  type Movie,
  type Showtime,
} from "./data";
import type { UpcomingMovie } from "@/features/billboard/interfaces/upcoming.interface";

export type Screening = Showtime & {
  id: string;
  movieId: string;
  cityId: string;
  date: string;
  startsAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const PENDING_KEY = "riwi:pending-function";

type UpcomingMovieApi = {
  id: string | number;
  title: string;
  synopsis?: string;
  releaseDate?: string;
  poster?: string;
  posterUrl?: string;
  genres?: string[];
  isNotified?: boolean;
};

function hash(text: string) {
  let h = 7;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 100003;
  return h;
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function normalizeMovie(raw: Partial<Movie> & { id: string | number; title: string; poster?: string; posterUrl?: string; trailerId?: string }): Movie {
  const fallback = movies[0]!;
  const id = String(raw.id ?? fallback.id);

  return {
    id,
    title: raw.title ?? fallback.title,
    poster: raw.poster ?? raw.posterUrl ?? fallback.poster,
    genres: raw.genres ?? fallback.genres,
    rating: raw.rating ?? fallback.rating,
    duration: raw.duration ?? fallback.duration,
    director: raw.director ?? fallback.director,
    cast: raw.cast ?? fallback.cast,
    languages: raw.languages ?? fallback.languages,
    formats: raw.formats ?? fallback.formats,
    score: raw.score ?? fallback.score,
    premiere: Boolean(raw.premiere ?? fallback.premiere),
    releaseDate: raw.releaseDate ?? fallback.releaseDate,
    synopsis: raw.synopsis ?? fallback.synopsis,
    trailerId: raw.trailerId ?? fallback.trailerId,
    showtimes: raw.showtimes ?? fallback.showtimes,
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

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

export async function fetchMoviesByCity(cityId: string): Promise<Movie[]> {
  try {
    const payload = await fetchJson<{ data?: Movie[]; movies?: Movie[] }>(
      `${API_BASE}/api/v1/movies/weekly?cityId=${encodeURIComponent(cityId)}`,
    );
    const items = payload.data || payload.movies || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item) => normalizeMovie(item as Partial<Movie> & { id: string | number; title: string }));
    }
  } catch {
    // fallback local
  }

  return delay(
    movies.filter((movie) => movie.showtimes.length > 0).slice(0, 6),
    250,
  );
}

export async function fetchTodayMovies(cityId: string): Promise<Movie[]> {
  try {
    const payload = await fetchJson<{ data?: Movie[]; movies?: Movie[] }>(
      `${API_BASE}/api/v1/movies/today?cityId=${encodeURIComponent(cityId)}`,
    );
    const items = payload.data || payload.movies || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item) => normalizeMovie(item as Partial<Movie> & { id: string | number; title: string }));
    }
  } catch {
    // fallback local
  }

  return delay(movies.slice(0, 4), 250);
}

export async function fetchUpcomingMovies(): Promise<UpcomingMovie[]> {
  try {
    const payload = await fetchJson<{ data?: UpcomingMovieApi[]; movies?: UpcomingMovieApi[] }>(
      `${API_BASE}/api/v1/movies/upcoming`,
    );
    const items = payload.data || payload.movies || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((movie) => ({
        id: String(movie.id),
        title: movie.title,
        synopsis: movie.synopsis || "Sin sinopsis disponible.",
        releaseDate: movie.releaseDate || "2026-01-01",
        posterUrl: movie.posterUrl || movie.poster || "",
        trailerUrl: movie.posterUrl || movie.poster || "",
        genres: movie.genres || [],
        isNotified: Boolean(movie.isNotified),
      }));
    }
  } catch {
    // fallback local
  }

  return delay<UpcomingMovie[]>(
    [
      { id: "1", title: "Nebulosa", synopsis: "Aviso para estrenos próximos.", releaseDate: "2026-08-22", posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", trailerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", genres: ["Ciencia Ficción", "Drama"], isNotified: false },
      { id: "2", title: "El Último Testigo", synopsis: "Próximo estreno del thriller del mes.", releaseDate: "2026-09-05", posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80", trailerUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80", genres: ["Thriller", "Misterio"], isNotified: false },
    ],
    250,
  );
}

export async function fetchMovie(movieId: string): Promise<Movie> {
  try {
    const payload = await fetchJson<Partial<Movie> & { id: string | number; title: string }>(
      `${API_BASE}/api/movies/${encodeURIComponent(movieId)}`,
    );
    if (payload && payload.id) {
      return normalizeMovie(payload);
    }
  } catch {
    // fallback local
  }

  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return Promise.reject(new Error("Película no encontrada"));
  return delay(movie, 250);
}

export function fetchFunctions(movieId: string, cityId: string | null): Promise<Screening[]> {
  if (!cityId) return delay([], 150);

  return fetchJson<Screening[]>(`${API_BASE}/api/movies/${encodeURIComponent(movieId)}/functions?cityId=${encodeURIComponent(cityId)}`)
    .catch(() => {
      const movie = movies.find((m) => m.id === movieId);
      if (!movie) return [];
      return buildScreenings(movie, cityId);
    });
}

export function fetchRecommendations(movieId: string): Promise<Movie[]> {
  return delay(
    movies.filter((m) => m.id !== movieId).slice(0, 4),
    350,
  );
}

export async function subscribeToUpcomingNotification(movieId: string): Promise<void> {
  await fetchJson<{ ok: boolean }>(`${API_BASE}/api/v1/notifications/upcoming`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieId }),
  });
}

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
