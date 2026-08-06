import type { UpcomingMovie } from "../interfaces/upcoming.interface";

// Datos locales en memoria para probar la interfaz inmediatamente
const MOCK_MOVIES: UpcomingMovie[] = [
  {
    id: "1",
    title: "Nebulosa",
    synopsis: "Una misión espacial tripulada hacia la primera nebulosa cartografiada revela que no están solos en el universo.",
    releaseDate: "2026-08-22",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    genres: ["Ciencia Ficción", "Drama"],
    isNotified: false
  },
  {
    id: "2",
    title: "El Último Testigo",
    synopsis: "El único testigo de un crimen en el que el acusado es el fiscal del caso deberá desenterrar la verdad.",
    releaseDate: "2026-09-05",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    genres: ["Thriller", "Misterio"],
    isNotified: false
  }
];

export const getUpcomingMovies = async (): Promise<UpcomingMovie[]> => {
  return MOCK_MOVIES;
};

export const getUpcomingMovieById = async (id: string): Promise<UpcomingMovie> => {
  const movie = MOCK_MOVIES.find(m => m.id === id);
  if (!movie) throw new Error('Película no encontrada');
  return movie;
};

export const subscribeToUpcomingNotification = async (movieId: string): Promise<void> => {
  console.log(`Notificación simulada para la película: ${movieId}`);
};