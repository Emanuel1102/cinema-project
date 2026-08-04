export interface UpcomingMovie {
    id: string;
    title: string;
    synopsis: string;
    releaseDate:string;
    posterUrl: string;
    trailerUrl: string;
    genres: string[];
    estimatedCityRelease?: string;
    isNotified?: boolean;
}

export interface UpcomingResponse{
    data: UpcomingMovie[];
}