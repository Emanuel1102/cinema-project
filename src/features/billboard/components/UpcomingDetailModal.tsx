import React, { useEffect } from 'react';
import { X } from 'lucide-react';
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
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!movie) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-[#070913]/85 p-4 text-white backdrop-blur-sm">
      <div onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Detalle de ${movie.title}`} className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <button
          onClick={onClose}
          aria-label="Cerrar detalle"
          className="absolute right-4 top-4 z-10 rounded-xl border border-white/10 bg-[#0F172A]/80 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
        <div className="aspect-video w-full bg-black p-1 sm:p-2">
          <iframe
            src={movie.trailerUrl}
            title={`Tráiler de ${movie.title}`}
            className="h-full w-full rounded-[18px]"
            allowFullScreen
          />
        </div>
        <div className="space-y-4 p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#818CF8]">Próximo estreno</p>
          <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
          <p className="text-sm leading-relaxed text-slate-300">{movie.synopsis}</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs text-slate-400">
              Estreno estimado: {new Date(movie.releaseDate).toLocaleDateString()}
            </span>
            <button
              disabled={movie.isNotified}
              onClick={() => (isAuthenticated ? onNotify(movie.id) : onOpenAuth())}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 hover:scale-[1.02] ${
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
