import { Link } from "react-router";
import { RegisterForm } from "../../components";

export function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-violet-500/20 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
        <div className="rounded-[2rem] bg-[#111827]/90 p-8 sm:p-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-[#7C3AED]">Crea tu cuenta</h1>
            <p className="mt-3 text-base text-slate-300">Regístrate para reservar y comprar entradas en Riwi Films con una experiencia rápida y segura.</p>
            <Link to="/login" className="mt-4 inline-block text-sm font-medium text-[#7C3AED] hover:underline">¿Ya tienes cuenta? Volver al login</Link>
          </div>
        </div>
        <div className="mt-6 p-6 sm:p-10"><RegisterForm /></div>
      </div>
    </main>
  );
}
