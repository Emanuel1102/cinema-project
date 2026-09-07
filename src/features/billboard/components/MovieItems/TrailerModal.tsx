import { X, Film, Volume2 } from "lucide-react";
import { useEffect } from "react";

function getYouTubeEmbedUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // If it's already an embed URL
  if (trimmed.includes("youtube.com/embed/")) {
    const id = trimmed.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  // Standard youtube.com/watch?v=ID
  if (trimmed.includes("v=")) {
    const id = trimmed.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  // Shortened youtu.be/ID
  if (trimmed.includes("youtu.be/")) {
    const id = trimmed.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  // Otherwise, treat input as raw video ID
  return `https://www.youtube.com/embed/${trimmed}?autoplay=1&rel=0`;
}

export function TrailerModal({
  title,
  trailerId,
  onClose,
}: {
  title: string;
  trailerId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const embedUrl = getYouTubeEmbedUrl(trailerId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tráiler de ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070913]/85 p-4 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/15 bg-[#111827] shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-all duration-300 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-[#7C3AED]/20 text-[#818CF8]">
              <Film className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#818CF8]">
                  Tráiler Oficial
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <Volume2 className="size-3" /> HD
                </span>
              </div>
              <p className="mt-0.5 text-base font-bold text-white">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar tráiler"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition duration-200 hover:bg-white/15 hover:text-white active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="bg-black p-1 sm:p-2">
          <iframe
            title={`Tráiler de ${title}`}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-[18px] border border-white/5"
          />
        </div>
      </div>
    </div>
  );
}


