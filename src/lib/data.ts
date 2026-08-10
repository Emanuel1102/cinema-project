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
    id: "spider-man-brand-new-day",
    title: "Spider-Man: Brand New Day",
    poster: poster1,
    genres: ["Acción", "Aventura", "Ciencia ficción"],
    rating: "PG-13",
    duration: 145,
    director: "Destin Daniel Cretton",
    cast: ["Tom Holland", "Zendaya", "Sadie Sink", "Jon Bernthal"],
    languages: ["Inglés", "Español"],
    formats: ["2D", "3D", "IMAX"],
    score: 4.8,
    premiere: true,
    releaseDate: "2026-07-24",
    synopsis:
      "Tras los eventos de 'No Way Home', Peter Parker intenta llevar una vida universitaria anónima mientras patrulla las calles de Nueva York. Sin embargo, la aparición de una nueva amenaza callejera y rastros del multiverso lo obligarán a asumir de nuevo su identidad como Spider-Man.",
    trailerId: "aqz-KE-bpKQ",
    showtimes: buildShowtimes(["2D", "3D", "IMAX"], ["Subtitulada", "Doblada"]),
  },
    {
    id: "halo-4-forward-unto-dawn",
    title: "Halo 4: Forward Unto Dawn",
    poster: poster2,
    genres: ["Acción", "Ciencia ficción", "Aventura"],
    rating: "PG-13",
    duration: 91,
    director: "Stewart Hendler",
    cast: ["Tom Green", "Anna Popplewell", "Daniel Cudmore", "Enisha Brewster"],
    languages: ["Inglés", "Español"],
    formats: ["2D"],
    score: 4.5,
    premiere: false,
    releaseDate: "2012-10-05",
    synopsis:
      "El cadete Thomas Lasky entrena en la Academia Militar Corbould para luchar contra los rebeldes humanos. Sin embargo, cuando la alianza alienígena Covenant invade el planeta, Lasky y sus compañeros deberán luchar por sobrevivir con la ayuda del legendario Master Chief.",
    trailerId: "Ca3Y8xGctlE",
    showtimes: buildShowtimes(["2D"], ["Subtitulada", "Doblada"]),
  },
    {
    id: "cars-3",
    title: "Cars 3",
    poster: poster3,
    genres: ["Animación", "Familiar", "Comedia", "Aventura"],
    rating: "ATP",
    duration: 102,
    director: "Brian Fee",
    cast: ["Owen Wilson", "Cristela Alonzo", "Chris Cooper", "Armie Hammer"],
    languages: ["Inglés", "Español"],
    formats: ["2D", "3D"],
    score: 4.4,
    premiere: false,
    releaseDate: "2017-06-16",
    synopsis:
      "Sorprendido por una nueva generación de corredores ultrarrápidos, el legendario Rayo McQueen queda relegado repentinamente del deporte que tanto ama. Para volver a las pistas, necesitará la ayuda de la joven entrenadora Cruz Ramírez y la inspiración del fabuloso Hudson Hornet.",
    trailerId: "2LeOH9AGJQM",
    showtimes: buildShowtimes(["2D", "3D"], ["Subtitulada", "Doblada"]),
  },
    {
    id: "deadpool",
    title: "Deadpool",
    poster: poster4,
    genres: ["Acción", "Comedia", "Ciencia ficción"],
    rating: "+18",
    duration: 108,
    director: "Tim Miller",
    cast: ["Ryan Reynolds", "Morena Baccarin", "Ed Skrein", "T.J. Miller"],
    languages: ["Inglés", "Español"],
    formats: ["2D", "IMAX"],
    score: 4.6,
    premiere: false,
    releaseDate: "2016-02-12",
    synopsis:
      "Basada en el antihéroe más poco convencional de Marvel Comics, Deadpool cuenta la historia del origen del ex agente de las Fuerzas Especiales convertido en mercenario Wade Wilson, quien después de ser sometido a un experimento que lo deja con poderes de curación acelerada, adopta el alter ego Deadpool. Armado con sus nuevas habilidades y un sentido del humor oscuro y retorcido, Deadpool caza al hombre que casi destruye su vida.",
    trailerId: "ONHBaC-pfsk",
    showtimes: buildShowtimes(["2D", "IMAX"], ["Subtitulada", "Doblada"]),
}
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
