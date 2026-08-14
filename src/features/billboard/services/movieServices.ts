import type { Movie } from '../interfaces/movie.interface';
import { getSavedLocationPreference } from './locationServices';

// Datos de prueba (MOCK)
const MOCK_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Neon Genesis: Revival',
    posterUrl: 'https://via.placeholder.com/300x400',
    genre: ['Acción', 'Sci-Fi'],
    cityIds: ['bog-city', 'baq'], // Bogotá y Barranquilla
  },
  {
    id: 'mov-2',
    title: 'Nebula Ascent',
    posterUrl: 'https://via.placeholder.com/300x400',
    genre: ['Aventura', 'Sci-Fi'],
    cityIds: ['bog-city'], // Solo Bogotá
  },
  {
    id: 'mov-3',
    title: 'The Last Reflection',
    posterUrl: 'https://via.placeholder.com/300x400',
    genre: ['Drama', 'Misterio'],
    cityIds: ['baq'], // Solo Barranquilla
  },
];

// Función que aplica la lógica de filtrado por ciudad
export const getMoviesByCurrentCity = async (): Promise<Movie[]> => {
  const savedLocation = getSavedLocationPreference();
  const activeCityId = savedLocation?.cityId || 'baq';

  // Filtramos la lista según la ciudad activa
  const filteredMovies = MOCK_MOVIES.filter((movie) =>
    movie.cityIds.includes(activeCityId)
  );

  return Promise.resolve(filteredMovies);
};