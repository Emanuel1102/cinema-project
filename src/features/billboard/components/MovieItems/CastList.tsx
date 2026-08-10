import { User } from "lucide-react";

export function CastList({ cast }: { cast: string[] }) {
  return (
    <div className="surface-panel p-5">
      <h2 className="text-lg font-bold">Reparto</h2>
      <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {cast.map((actor) => (
          <li
            key={actor}
            className="flex min-w-[130px] flex-col items-center gap-2 rounded-xl bg-secondary/60 p-3 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/20">
              <User className="size-5 text-accent" />
            </span>
            <span className="text-xs font-semibold leading-tight">{actor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
