import { useEffect, useState, useCallback } from "react";
import { Play, Star, Clock, ChevronLeft, ChevronRight, Ticket, Info, Sparkles } from "lucide-react";
import { Link } from "react-router";
import type { Movie } from "@/lib/data";
import bannerImg from "@/assets/hero.png";

interface MovieHeroProps {
  movie?: Movie;
  movies?: Movie[];
  onTrailer?: (movie: Movie) => void;
  onReserve?: (movie: Movie) => void;
}

export function MovieHero({ movie, movies, onTrailer, onReserve }: MovieHeroProps) {
  const movieList = movies && movies.length > 0 ? movies : movie ? [movie] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isCarousel = movieList.length > 1;
  const currentMovie = movieList[currentIndex] ?? movie;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movieList.length);
  }, [movieList.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movieList.length) % movieList.length);
  }, [movieList.length]);

  // Auto-play for carousel
  useEffect(() => {
    if (!isCarousel || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isCarousel, isPaused, nextSlide]);

  if (!currentMovie) return null;

  return (
    <section
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d1527] shadow-[0_25px_80px_rgba(15,23,42,0.7)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Image with Gradient Overlay */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[400px]">
        {movieList.map((m, idx) => (
          <div
            key={m.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <img
              src={m.poster || bannerImg}
              alt=""
              className="h-full w-full object-cover object-center opacity-30 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1326] via-[#0b1326]/60 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto -mt-44 max-w-7xl px-6 pb-8 sm:-mt-64 sm:px-8 lg:px-12">
        <div
          key={currentMovie.id}
          className="flex flex-col gap-6 sm:flex-row sm:items-end animate-fadeIn transition-all duration-500"
        >
          {/* Movie Poster */}
          <div className="group relative shrink-0">
            <img
              src={currentMovie.poster}
              alt={`Póster de ${currentMovie.title}`}
              width={683}
              height={1024}
              className="w-36 rounded-2xl border-2 border-white/15 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition duration-300 group-hover:scale-[1.02] sm:w-52 lg:w-60"
            />
            {currentMovie.premiere && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md shadow-lg">
                <Sparkles className="size-3" /> Estreno
              </span>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {currentMovie.score.toFixed(1)}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-slate-200">
                {currentMovie.rating}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-slate-200">
                <Clock className="size-3.5 text-slate-400" />
                {currentMovie.duration} min
              </span>
            </div>

            {/* Title & Synopsis */}
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {currentMovie.title}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#818CF8]">
              {currentMovie.genres.join(" · ")}
            </p>
            <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {currentMovie.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onTrailer?.(currentMovie)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#818CF8] to-[#DB2777] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#7C3AED]/30 transition duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
              >
                <Play className="size-4 fill-white" /> Ver tráiler
              </button>

              {onReserve && (
                <button
                  onClick={() => onReserve(currentMovie)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition duration-200 hover:bg-white/20 hover:scale-[1.02] active:scale-95"
                >
                  <Ticket className="size-4 text-[#818CF8]" /> Reservar
                </button>
              )}

              <Link
                to={`/movies/details/${currentMovie.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                <Info className="size-4" /> Detalle
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls & Indicators */}
        {isCarousel && (
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {movieList.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ir al slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-gradient-to-r from-[#7C3AED] to-[#818CF8]"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Anterior película"
                className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white active:scale-95"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Siguiente película"
                className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-300 backdrop-blur-md transition hover:bg-white/15 hover:text-white active:scale-95"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

