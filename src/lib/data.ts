import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";

export type Country = { id: string; name: string };
export type Department = { id: string; countryId: string; name: string };
export type City = { id: string; departmentId: string; name: string; hasCinemas: boolean };

export const countries: Country[] = [
  { id: "co", name: "Colombia" },
  { id: "mx", name: "México" },
  { id: "pe", name: "Perú" },
];

export const departments: Department[] = [
  { id: "ant", countryId: "co", name: "Antioquia" },
  { id: "cun", countryId: "co", name: "Cundinamarca" },
  { id: "val", countryId: "co", name: "Valle del Cauca" },
  { id: "cdmx", countryId: "mx", name: "Ciudad de México" },
  { id: "jal", countryId: "mx", name: "Jalisco" },
  { id: "lim", countryId: "pe", name: "Lima" },
];

export const cities: City[] = [
  { id: "medellin", departmentId: "ant", name: "Medellín", hasCinemas: true },
  { id: "envigado", departmentId: "ant", name: "Envigado", hasCinemas: true },
  { id: "jardin", departmentId: "ant", name: "Jardín", hasCinemas: false },
  { id: "bogota", departmentId: "cun", name: "Bogotá", hasCinemas: true },
  { id: "zipaquira", departmentId: "cun", name: "Zipaquirá", hasCinemas: false },
  { id: "cali", departmentId: "val", name: "Cali", hasCinemas: true },
  { id: "benito", departmentId: "cdmx", name: "Benito Juárez", hasCinemas: true },
  { id: "guadalajara", departmentId: "jal", name: "Guadalajara", hasCinemas: true },
  { id: "miraflores", departmentId: "lim", name: "Miraflores", hasCinemas: true },
  { id: "barranco", departmentId: "lim", name: "Barranco", hasCinemas: false },
];

export type Showtime = {
  time: string;
  format: string;
  room: string;
  audio: "Doblada" | "Subtitulada";
  complex: string;
  seatsLeft: number;
  price: number;
};

export type Movie = {
  id: string;
  title: string;
  poster: string;
  genres: string[];
  rating: string;
  duration: number;
  director: string;
  cast: string[];
  languages: string[];
  formats: string[];
  score: number;
  premiere: boolean;
  releaseDate: string;
  synopsis: string;
  trailerId: string;
  showtimes: Showtime[];
};

const times = ["13:20", "15:40", "18:10", "20:30", "22:45"];
const complexes = ["Riwi Films El Poblado", "Riwi Films Centro", "Riwi Films Norte"];

function buildShowtimes(formats: string[], audios: Showtime["audio"][]): Showtime[] {
  return times.map((time, i) => ({
    time,
    format: formats[i % formats.length]!,
    room: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Standard" : "XD",
    audio: audios[i % audios.length]!,
    complex: complexes[i % complexes.length]!,
    seatsLeft: [42, 8, 0, 25, 61][i]!,
    price: 18000 + i * 3500,
  }));
}

export const movies: Movie[] = [
  {
    id: "orbita-cero",
    title: "Órbita Cero",
    poster: poster1,
    genres: ["Ciencia ficción", "Suspenso"],
    rating: "PG-13",
    duration: 132,
    director: "Ana Sofía Restrepo",
    cast: ["Camilo Vélez", "Laura Ochoa", "Tom Rhodes", "Nadia Prieto"],
    languages: ["Inglés", "Español"],
    formats: ["2D", "3D", "IMAX"],
    score: 4.6,
    premiere: true,
    releaseDate: "2026-07-30",
    synopsis:
      "Un astronauta despierta solo en una estación orbital que ya no responde a la Tierra. Cada hora que pasa, la memoria de su misión se reescribe.",
    trailerId: "aqz-KE-bpKQ",
    showtimes: buildShowtimes(["2D", "3D", "IMAX"], ["Subtitulada", "Doblada"]),
  },
  {
    id: "ballena-de-papel",
    title: "Ballena de Papel",
    poster: poster2,
    genres: ["Animación", "Familiar", "Aventura"],
    rating: "ATP",
    duration: 98,
    director: "Marcos Iriarte",
    cast: ["Valeria Gómez", "Julián Mesa", "Sara Lindo"],
    languages: ["Español"],
    formats: ["2D", "3D"],
    score: 4.8,
    premiere: false,
    releaseDate: "2026-07-09",
    synopsis:
      "Una niña construye una ballena de papel que decide volar sobre la ciudad, llevándose con ella todos los deseos que nadie se atrevió a pedir.",
    trailerId: "aqz-KE-bpKQ",
    showtimes: buildShowtimes(["2D", "3D"], ["Doblada"]),
  },
  {
    id: "lluvia-de-septiembre",
    title: "Lluvia de Septiembre",
    poster: poster3,
    genres: ["Drama", "Romance"],
    rating: "+15",
    duration: 115,
    director: "Helena Duarte",
    cast: ["Mateo Arango", "Irene Solís", "Pablo Marín"],
    languages: ["Español", "Francés"],
    formats: ["2D"],
    score: 4.2,
    premiere: false,
    releaseDate: "2026-06-18",
    synopsis:
      "Dos desconocidos comparten un paraguas durante la tormenta más larga de la ciudad y descubren que ya se habían despedido antes.",
    trailerId: "aqz-KE-bpKQ",
    showtimes: buildShowtimes(["2D"], ["Subtitulada"]),
  },
  {
    id: "golpe-neon",
    title: "Golpe Neón",
    poster: poster4,
    genres: ["Acción", "Thriller"],
    rating: "+18",
    duration: 124,
    director: "Ravi Kapoor",
    cast: ["Diego Salas", "Miranda Cho", "Elías Fuentes", "Karen Ruiz"],
    languages: ["Inglés"],
    formats: ["2D", "IMAX", "4DX"],
    score: 4.4,
    premiere: true,
    releaseDate: "2026-07-31",
    synopsis:
      "El robo perfecto dura cuatro minutos. El problema es la quinta persona del equipo, la que nadie contrató.",
    trailerId: "aqz-KE-bpKQ",
    showtimes: buildShowtimes(["IMAX", "4DX", "2D"], ["Subtitulada", "Doblada"]),
  },
];

export const allGenres = [...new Set(movies.flatMap((m) => m.genres))].sort();
export const allRatings = [...new Set(movies.map((m) => m.rating))];
export const allLanguages = [...new Set(movies.flatMap((m) => m.languages))].sort();
export const allFormats = [...new Set(movies.flatMap((m) => m.formats))];
export const allRooms = ["Standard", "Premium", "XD"];
export const allComplexes = complexes;

export function next7Days(): Date[] {
  const base = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}

export const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const monthLabels = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function formatCOP(value: number) {
  return "$" + value.toLocaleString("es-CO");
}
