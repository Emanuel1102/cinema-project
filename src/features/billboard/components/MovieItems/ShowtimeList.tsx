import { formatCOP } from "@/lib/data";
import type { Screening } from "@/lib/movies-api";

export function ShowtimeList({
  functions,
  loading,
  selectedId,
  onSelect,
}: {
  functions: Screening[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (s: Screening) => void;
}) {
  if (loading) {
    return (
      <div className="mt-4 space-y-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />
        ))}
      </div>
    );
  }

  if (functions.length === 0) {
    return (
      <p className="mt-4 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
        No hay funciones futuras para esta combinación de ciudad, fecha y formato.
      </p>
    );
  }

  const byComplex = functions.reduce<Record<string, Screening[]>>((acc, s) => {
    (acc[s.complex] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="mt-4 space-y-5">
      {Object.entries(byComplex).map(([complex, list]) => (
        <div key={complex}>
          <p className="text-sm font-semibold">{complex}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {list.map((s) => {
              const soldOut = s.seatsLeft === 0;
              const selected = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  disabled={soldOut}
                  aria-pressed={selected}
                  onClick={() => onSelect(s)}
                  title={soldOut ? "Función agotada" : `Sala ${s.room} · ${s.audio}`}
                  className={[
                    "rounded-xl border px-3 py-2 text-left text-xs transition",
                    soldOut
                      ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-50"
                      : selected
                        ? "border-accent bg-primary text-primary-foreground"
                        : "border-border bg-secondary hover:border-accent",
                  ].join(" ")}
                >
                  <span className="block text-sm font-bold">{s.time}</span>
                  <span className="block opacity-80">
                    {s.format} · Sala {s.room}
                  </span>
                  <span className="block opacity-80">{s.audio}</span>
                  <span className="block font-semibold">
                    {soldOut ? "Agotado" : formatCOP(s.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
