import { useNavigate } from "react-router";

type BackToHomeButtonProps = {
  className?: string;
};

export function BackToHomeButton({ className = "" }: BackToHomeButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/movies")}
      className={`rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition duration-200 hover:bg-white/10 hover:text-white ${className}`}
    >
      ← Regresar a la cartelera
    </button>
  );
}
