import type { UpcomingMovie } from "../interfaces/upcoming.interface";

//Remplazar por cliente HTTP centralizado (Axios/Fetch) opcional
const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const getUpcomingMovie = async (): Promise<UpcomingMovie[]> =>{
    const response = await fetch (`${BASE_URL}/movies/upcoming`);
    if(!response.ok) throw new Error('Error al obtener los proximos estrenos');
    return response.json();
};

export const getUpcomingMovieById = async (id: string): Promise<UpcomingMovie> =>{
    const response = await fetch(`${BASE_URL}/movies/upcoming/${id}`);
    if (!response.ok) throw new Error('Error al obtener los detalles del estreno');
    return response.json();
};

export const subscribeToUpcomingNotification = async (movieId: string) :Promise<void> => {
    const response = await fetch(`${BASE_URL}/notifications/upcoming`,{
        method: 'POST',
        headers:{ 'Content-Type': 'application/json'},
        body: JSON.stringify({ movieId }),

    });
    if (!response.ok) throw new Error('Error al registrar la notificacion');
};