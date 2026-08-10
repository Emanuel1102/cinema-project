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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4"
      onClick={onClose}
    >
      <div
        className="surface-panel w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm font-semibold">Tráiler · {title}</p>
          <button onClick={onClose} aria-label="Cerrar tráiler" className="btn-ghost p-2">
            <X className="size-4" />
          </button>
        </div>
        <iframe
          title={`Tráiler de ${title}`}
          src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    </div>
  );
}
