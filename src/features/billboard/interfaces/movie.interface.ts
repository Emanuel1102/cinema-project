 // Únicamente la definición de la estructura (Tipado)
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  genre: string[];
  cityIds: string[]; // Lista de IDs de ciudades donde está disponible
}