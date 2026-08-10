import { dateKey, dayLabels, monthLabels } from "@/lib/data";

export function ShowtimeFilters({
  days,
  selectedDay,
  onDay,
  formats,
  format,
  onFormat,
  cityOptions,
  cityId,
  onCity,
}: {
  days: Date[];
  selectedDay: string;
  onDay: (key: string) => void;
  formats: string[];
  format: string;
  onFormat: (f: string) => void;
  cityOptions: { id: string; name: string }[];
  cityId: string;
  onCity: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="city" className="text-xs font-semibold uppercase text-muted-foreground">
          Ciudad
        </label>
        <select
          id="city"
          value={cityId}
          onChange={(e) => onCity(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm sm:max-w-xs"
        >
          <option value="">Selecciona una ciudad</option>
          {cityOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const key = dateKey(d);
          const active = key === selectedDay;
          return (
            <button
              key={key}
              onClick={() => onDay(key)}
              aria-pressed={active}
              className={
                active
                  ? "btn-primary min-w-[70px] px-3 py-2 text-xs"
                  : "btn-ghost min-w-[70px] px-3 py-2 text-xs"
              }
            >
              <span className="block font-semibold">{dayLabels[d.getDay()]}</span>
              <span className="block text-base font-bold">{d.getDate()}</span>
              <span className="block opacity-70">{monthLabels[d.getMonth()]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {formats.map((f) => (
          <button
            key={f}
            onClick={() => onFormat(f)}
            aria-pressed={f === format}
            className={f === format ? "chip-accent px-3 py-1.5" : "chip px-3 py-1.5"}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
