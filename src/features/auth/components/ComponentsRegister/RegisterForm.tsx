import React from 'react'
import type {
  PersonalInfo,
  ContactInfo,
  SecurityInfo,
  Preferences,
  Consents,
  RegisterPayload,
} from '../../interfaces'
import { ProgressIndicator } from './ProgressIndicator'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { CaptchaStub } from './CaptchaStub'
import { Confirmation } from './Confirmation'
import { register } from '../../services/api'

// RegisterForm: modular, multi-step registration form.
// Responsibilities:
// - Collect personal, contact, security, preferences and consent data.
// - Validate inputs on the client according to HU-FE-006 rules.
// - Show field-level errors and map backend errors to fields.
// - Submit payload to `POST /auth/register` and show confirmation.
const steps = ['Personal', 'Contact', 'Security', 'Preferences', 'Consent', 'Review']

const initialPersonal: PersonalInfo = {
  firstName: '',
  lastName: '',
  documentType: 'ID',
  documentNumber: '',
  birthDate: '',
  gender: '',
}

const initialContact: ContactInfo = { email: '', emailConfirm: '', phone: '' }
const initialSecurity: SecurityInfo = { password: '', passwordConfirm: '' }
const initialPreferences: Preferences = { city: '', favoriteComplex: '' }
const initialConsents: Consents = { dataProcessing: false, terms: false, marketing: false }

function validateEmail(e: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)
}

function validatePhone(p: string) {
  return /^\+?[0-9]{7,15}$/.test(p)
}

function validateDocument(n: string) {
  return /^[A-Za-z0-9\-]{4,20}$/.test(n)
}

// Note: validation functions are intentionally straightforward and
// implemented here so the component is self-contained and easy to follow.

function validatePassword(p: string) {
  if (!p) return false
  if (p.length < 10) return false
  if (!/[A-Z]/.test(p)) return false
  if (!/[a-z]/.test(p)) return false
  if (!/[0-9]/.test(p)) return false
  if (!/[^A-Za-z0-9]/.test(p)) return false
  return true
}

export const RegisterForm: React.FC = () => {
  const [current, setCurrent] = React.useState(0)
  const [personal, setPersonal] = React.useState(initialPersonal)
  const [contact, setContact] = React.useState(initialContact)
  const [security, setSecurity] = React.useState(initialSecurity)
  const [preferences, setPreferences] = React.useState(initialPreferences)
  const [consents, setConsents] = React.useState(initialConsents)
  const [captchaToken, setCaptchaToken] = React.useState('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [completedEmail, setCompletedEmail] = React.useState<string | null>(null)

  function goto(step: number) {
    setErrors({})
    setCurrent(step)
  }

  function validateStep(stepIndex: number) {
    const newErrors: Record<string, string> = {}
    if (stepIndex === 0) {
      if (!personal.firstName) newErrors['firstName'] = 'Required'
      if (!personal.lastName) newErrors['lastName'] = 'Required'
      if (!validateDocument(personal.documentNumber)) newErrors['documentNumber'] = 'Invalid format'
      if (!personal.birthDate || new Date(personal.birthDate) > new Date()) newErrors['birthDate'] = 'Invalid birth date'
    }
    if (stepIndex === 1) {
      if (!validateEmail(contact.email)) newErrors['email'] = 'Invalid email'
      if (contact.email !== contact.emailConfirm) newErrors['emailConfirm'] = 'Emails do not match'
      if (!validatePhone(contact.phone)) newErrors['phone'] = 'Invalid phone number'
    }
    if (stepIndex === 2) {
      if (!validatePassword(security.password)) newErrors['password'] = 'Password does not meet requirements'
      if (security.password !== security.passwordConfirm) newErrors['passwordConfirm'] = 'Passwords do not match'
    }
    if (stepIndex === 4) {
      if (!consents.dataProcessing) newErrors['dataProcessing'] = 'Required'
      if (!consents.terms) newErrors['terms'] = 'Required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    // validate all
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setCurrent(i)
        return
      }
    }
    if (!captchaToken) {
      setErrors({ captcha: 'Complete the CAPTCHA' })
      setCurrent(4)
      return
    }
    setSubmitting(true)
    const payload: RegisterPayload = {
      personal,
      contact,
      security,
      preferences,
      consents,
      captchaToken,
    }
    const res = await register(payload)
    setSubmitting(false)
    if (!res.ok) {
      // Map backend errors to fields if provided
      const map: Record<string, string> = {}
      ;(res.errors || []).forEach((er: any) => {
        if (er.field) map[er.field] = er.message
      })
      if (res.message && !(res.errors && res.errors.length)) {
        map['form'] = res.message
      }
      setErrors(map)
      // If server says email already registered, show on email field
      if (res.message && /email already/i.test(res.message)) map['email'] = res.message
      setErrors(map)
      return
    }
    // Success: show confirmation about email verification
    setCompletedEmail(contact.email)
  }

  if (completedEmail) {
    return <Confirmation email={completedEmail} />
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-[2rem] border border-violet-500/20 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl text-slate-100 transition sm:p-8"
    >
      <ProgressIndicator steps={steps} current={current} />

      {current === 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#818CF8]">Información personal</h2>
            <p className="mt-1 text-sm text-[#c7d2fe]">
              Completa tus datos personales para continuar con el registro.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Nombre</span>
              <input
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                value={personal.firstName}
                onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                placeholder="Tu nombre"
              />
              {errors.firstName && <div className="mt-1 text-xs text-[#DB2777]">{errors.firstName}</div>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Apellido</span>
              <input
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                value={personal.lastName}
                onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                placeholder="Tu apellido"
              />
              {errors.lastName && <div className="mt-1 text-xs text-[#DB2777]">{errors.lastName}</div>}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Tipo de documento</span>
              <select
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                value={personal.documentType}
                onChange={(e) => setPersonal({ ...personal, documentType: e.target.value })}
              >
                <option>C.C. (Cedula de Ciudadania)</option>
                 <option>T.I. (Tarjeta de Identidad)</option>
                <option>Passport</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Número de documento</span>
              <input
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                value={personal.documentNumber}
                onChange={(e) => setPersonal({ ...personal, documentNumber: e.target.value })}
                placeholder="12345678"
              />
              {errors.documentNumber && <div className="mt-1 text-xs text-[#DB2777]">{errors.documentNumber}</div>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Fecha de nacimiento</span>
              <input
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                type="date"
                value={personal.birthDate}
                onChange={(e) => setPersonal({ ...personal, birthDate: e.target.value })}
              />
              {errors.birthDate && <div className="mt-1 text-xs text-[#DB2777]">{errors.birthDate}</div>}
            </label>
          </div>
        </div>
      )}

      {current === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#818CF8]">Contacto</h2>
            <p className="mt-1 text-sm text-[#c7d2fe]">
              Usa un correo válido y un teléfono de contacto real.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Correo</span>
              <input
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="tu@correo.com"
              />
              {errors.email && <div className="mt-1 text-xs text-[#DB2777]">{errors.email}</div>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Confirmar correo</span>
              <input
                className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
                type="email"
                value={contact.emailConfirm}
                onChange={(e) => setContact({ ...contact, emailConfirm: e.target.value })}
                placeholder="Repite tu correo"
              />
              {errors.emailConfirm && <div className="mt-1 text-xs text-[#DB2777]">{errors.emailConfirm}</div>}
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Teléfono</span>
            <input
              className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="+52 123 456 7890"
            />
            {errors.phone && <div className="mt-1 text-xs text-[#DB2777]">{errors.phone}</div>}
          </label>
        </div>
      )}

      {current === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#818CF8]">Seguridad</h2>
            <p className="mt-1 text-sm text-[#c7d2fe]">
              Elige una contraseña segura y confírmala.
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Contraseña</span>
            <input
              className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
              type="password"
              value={security.password}
              onChange={(e) => setSecurity({ ...security, password: e.target.value })}
              placeholder="••••••••••"
            />
            {errors.password && <div className="mt-1 text-xs text-[#DB2777]">{errors.password}</div>}
          </label>

          <PasswordStrengthMeter password={security.password} />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Confirmar contraseña</span>
            <input
              className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
              type="password"
              value={security.passwordConfirm}
              onChange={(e) => setSecurity({ ...security, passwordConfirm: e.target.value })}
              placeholder="••••••••••"
            />
            {errors.passwordConfirm && <div className="mt-1 text-xs text-[#DB2777]">{errors.passwordConfirm}</div>}
          </label>

          <p className="text-sm text-[#c7d2fe]">
            La contraseña debe tener al menos 10 caracteres e incluir mayúsculas, minúsculas, números y un carácter especial.
          </p>
        </div>
      )}

      {current === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#818CF8]">Preferencias</h2>
            <p className="mt-1 text-sm text-[#c7d2fe]">
              Cuéntanos tu ciudad principal y tu complejo favorito (opcional).
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Ciudad principal</span>
            <input
              className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
              value={preferences.city}
              onChange={(e) => setPreferences({ ...preferences, city: e.target.value })}
              placeholder="Ciudad"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#c7d2fe]">Complejo favorito (opcional)</span>
            <input
              className="w-full rounded-[1rem] border border-[#7C3AED]/20 bg-[#111827] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20"
              value={preferences.favoriteComplex}
              onChange={(e) => setPreferences({ ...preferences, favoriteComplex: e.target.value })}
              placeholder="Nombre del cine"
            />
          </label>
        </div>
      )}

      {current === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#818CF8]">Consentimientos</h2>
            <p className="mt-1 text-sm text-[#c7d2fe]">
              Necesitamos tu permiso para procesar datos y activar tu cuenta.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#7C3AED]/40 bg-[#111827] text-[#7C3AED] focus:ring-[#7C3AED]/60"
                checked={consents.dataProcessing}
                onChange={(e) => setConsents({ ...consents, dataProcessing: e.target.checked })}
              />
              <span className="text-sm leading-6 text-[#c7d2fe]">
                Acepto el procesamiento de datos (requerido).
              </span>
            </label>
            {errors.dataProcessing && <div className="text-xs text-[#DB2777]">{errors.dataProcessing}</div>}

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#7C3AED]/40 bg-[#111827] text-[#7C3AED] focus:ring-[#7C3AED]/60"
                checked={consents.terms}
                onChange={(e) => setConsents({ ...consents, terms: e.target.checked })}
              />
              <span className="text-sm leading-6 text-[#c7d2fe]">
                Acepto los términos y condiciones (requerido).
              </span>
            </label>
            {errors.terms && <div className="text-xs text-[#DB2777]">{errors.terms}</div>}

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#7C3AED]/40 bg-[#111827] text-[#7C3AED] focus:ring-[#7C3AED]/60"
                checked={consents.marketing}
                onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })}
              />
              <span className="text-sm leading-6 text-[#c7d2fe]">
                Quiero recibir comunicaciones comerciales (opcional).
              </span>
            </label>
          </div>

          <CaptchaStub onVerify={(t) => setCaptchaToken(t)} />
          {errors.captcha && <div className="text-xs text-[#DB2777]">{errors.captcha}</div>}
        </div>
      )}

      {current === 5 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[#818CF8]">Revisión</h2>
            <p className="mt-1 text-sm text-[#c7d2fe]">
              Revisa tus datos antes de enviar el registro.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#7C3AED]/20 bg-[#111827] p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className="block text-xs uppercase tracking-wide text-[#c7d2fe]">Nombre</span>
                <p className="mt-1 text-sm text-slate-100">{personal.firstName} {personal.lastName}</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-[#c7d2fe]">Correo</span>
                <p className="mt-1 text-sm text-slate-100">{contact.email}</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-[#c7d2fe]">Teléfono</span>
                <p className="mt-1 text-sm text-slate-100">{contact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {current > 0 && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-[#7C3AED]/40 bg-[#111827] px-4 py-2.5 text-sm font-semibold text-[#c7d2fe] shadow-sm transition hover:border-[#7C3AED] hover:bg-[#1f1f2a]"
            onClick={() => goto(current - 1)}
            disabled={submitting}
          >
            Atrás
          </button>
        )}

        {current < steps.length - 1 ? (
          <button
            type="button"
            className="w-full rounded-2xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d28d9] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/30 sm:w-auto"
            onClick={() => {
              if (validateStep(current)) goto(current + 1)
            }}
            disabled={submitting}
          >
            Siguiente
          </button>
        ) : (
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d28d9] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/30"
            disabled={submitting}
          >
            {submitting ? 'Registrando...' : 'Registrarme'}
          </button>
        )}
      </div>

      {errors.form && <div className="mt-4 rounded-2xl bg-[#DB2777]/10 p-4 text-sm text-[#DB2777]">{errors.form}</div>}
    </form>
  )
}
