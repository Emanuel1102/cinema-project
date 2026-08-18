import React from 'react'
import type { LoginPayload } from '../../interfaces'
import { login } from '../../services/api'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '@/lib/store'

const initialState: LoginPayload = { email: '', password: '' }

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { login: saveUser } = useAuth()
  const [form, setForm] = React.useState(initialState)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [serverMessage, setServerMessage] = React.useState<string | null>(null)

  function validate() {
    const next: Record<string, string> = {}
    if (!form.email) next.email = 'Ingresa tu correo'
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Correo inválido'
    if (!form.password) next.password = 'Ingresa tu contraseña'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerMessage(null)
    if (!validate()) return
    setSubmitting(true)
    const res = await login(form)
    setSubmitting(false)

    if (!res.ok) {
      const next: Record<string, string> = {}
      if (res.message) next.form = res.message
      if (res.errors) {
        res.errors.forEach((error) => {
          if (error.field) next[error.field] = error.message
        })
      }
      setErrors(next)
      return
    }

    saveUser(form.email, undefined, res.accessToken)
    setServerMessage('Has iniciado sesión correctamente. Redirigiendo...')
    navigate('/movies')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-[2rem] border border-violet-500/20 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl text-slate-100 transition sm:p-8"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#818CF8]">Inicia sesión</h2>
          <p className="mt-1 text-sm text-[#c7d2fe]">
            Usa tu correo y contraseña para acceder a tu cuenta.
          </p>
        </div>

        {serverMessage && (
          <div className="rounded-[1.5rem] bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {serverMessage}
          </div>
        )}

        {errors.form && (
          <div className="rounded-[1.5rem] bg-[#4b2f63]/90 px-4 py-3 text-sm text-[#fda4af]">
            {errors.form}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Correo</span>
          <input
            className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@correo.com"
          />
          {errors.email && <div className="mt-1 text-xs text-[#DB2777]">{errors.email}</div>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Contraseña</span>
          <input
            className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Contraseña"
          />
          {errors.password && <div className="mt-1 text-xs text-[#DB2777]">{errors.password}</div>}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-[1rem] bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:bg-violet-900/50"
        >
          {submitting ? 'Ingresando...' : 'Entrar'}
        </button>

        <div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/register" className="text-[#818CF8] hover:text-[#a5b4fc]">
            Crear cuenta
          </Link>
          <a href="#" className="text-[#818CF8] hover:text-[#a5b4fc]">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </form>
  )
}
