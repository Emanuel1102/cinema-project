import { X } from "lucide-react";
import { useEffect } from "react";

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tráiler de ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070913]/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#818CF8]">Vista previa</p>
            <p className="mt-1 text-sm font-semibold text-white">Tráiler · {title}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar tráiler" className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
        <div className="bg-black p-1 sm:p-2"><iframe title={`Tráiler de ${title}`} src={`https://www.youtube.com/embed/62bIsvRcPv0?si=kx2OrTq2kwOJ4nBo${trailerId}?autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-[18px]" /></div>
      </div>
    </div>
  );
}
