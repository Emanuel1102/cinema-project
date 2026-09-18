import React from "react";

export interface ScreenIndicatorProps {
  /**
   * Text label displayed below the curved screen indicator.
   * Defaults to "PANTALLA".
   */
  label?: string;
  /**
   * Optional custom CSS class for outer container positioning/spacing.
   */
  className?: string;
}

export const ScreenIndicator: React.FC<ScreenIndicatorProps> = ({
  label = "PANTALLA",
  className = "",
}) => {
  return (
    <div
      role="img"
      aria-label={`Indicador de ${label}`}
      className={`relative flex w-full flex-col items-center justify-center select-none ${className}`}
    >
      {/* Ambient screen projection light cone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 h-16 w-3/4 max-w-2xl bg-gradient-to-b from-cyan-400/20 via-sky-500/10 to-transparent blur-xl"
      />

      {/* Curved SVG screen arc with glowing gradient stroke */}
      <div className="relative w-full max-w-2xl px-4 sm:px-8">
        <svg
          viewBox="0 0 600 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-full overflow-visible drop-shadow-[0_10px_25px_rgba(56,189,248,0.45)] sm:h-10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="screen-arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="75%" stopColor="#818cf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>
            <filter id="neon-glow" x="-10%" y="-30%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Primary glowing curved arc */}
          <path
            d="M 12 42 Q 300 6 588 42"
            stroke="url(#screen-arc-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />

          {/* Inner core bright specular highlight */}
          <path
            d="M 60 38 Q 300 10 540 38"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.65"
          />
        </svg>
      </div>

      {/* Screen Label with subtle tracking */}
      <div className="mt-1 flex items-center justify-center gap-2">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-500/50 sm:w-10" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground transition-colors sm:text-xs">
          {label}
        </span>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-cyan-500/50 sm:w-10" />
      </div>
    </div>
  );
};

export default ScreenIndicator;
