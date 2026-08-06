import React from 'react';
import type{ UpcomingMovie } from '../interfaces/upcoming.interface';

interface Props {
  movie: UpcomingMovie | null;
  onClose: () => void;
  onNotify: (movieId: string) => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

export const UpcomingDetailModal: React.FC<Props> = ({
  movie,
  onClose,
  onNotify,
  isAuthenticated,
  onOpenAuth,
}) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 text-white max-w-2xl w-full rounded-xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold z-10"
        >
          ✕
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={movie.trailerUrl}
            title={`Tráiler de ${movie.title}`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="text-gray-300 text-sm">{movie.synopsis}</p>
          <div className="flex justify-between items-center pt-4">
            <span className="text-xs text-gray-400">
              Estreno estimado: {new Date(movie.releaseDate).toLocaleDateString()}
            </span>
            <button
              disabled={movie.isNotified}
              onClick={() => (isAuthenticated ? onNotify(movie.id) : onOpenAuth())}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                movie.isNotified
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {movie.isNotified ? 'Notificación Activada' : 'Notificarme'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};