import React from 'react'
import type {
  PersonalInfo,
  ContactInfo,
  SecurityInfo,
  Preferences,
  Consents,
  RegisterPayload,
} from '../interfaces'
import { ProgressIndicator } from './ProgressIndicator'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { CaptchaStub } from './CaptchaStub'
import { Confirmation } from './Confirmation'
import { register } from '../services/api'

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
    <form onSubmit={handleSubmit} style={{ maxWidth: 720, margin: '0 auto', padding: 20 }}>
      <ProgressIndicator steps={steps} current={current} />

      {current === 0 && (
        <div>
          <h3>Personal Information</h3>
          <label>
            First name
            <input value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} />
            {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}
          </label>
          <label>
            Last name
            <input value={personal.lastName} onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} />
            {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}
          </label>
          <label>
            Document type
            <select value={personal.documentType} onChange={(e) => setPersonal({ ...personal, documentType: e.target.value })}>
              <option>ID</option>
              <option>Passport</option>
            </select>
          </label>
          <label>
            Document number
            <input value={personal.documentNumber} onChange={(e) => setPersonal({ ...personal, documentNumber: e.target.value })} />
            {errors.documentNumber && <div style={{ color: 'red' }}>{errors.documentNumber}</div>}
          </label>
          <label>
            Birth date
            <input type="date" value={personal.birthDate} onChange={(e) => setPersonal({ ...personal, birthDate: e.target.value })} />
            {errors.birthDate && <div style={{ color: 'red' }}>{errors.birthDate}</div>}
          </label>
        </div>
      )}

      {current === 1 && (
        <div>
          <h3>Contact</h3>
          <label>
            Email
            <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
          </label>
          <label>
            Confirm email
            <input value={contact.emailConfirm} onChange={(e) => setContact({ ...contact, emailConfirm: e.target.value })} />
            {errors.emailConfirm && <div style={{ color: 'red' }}>{errors.emailConfirm}</div>}
          </label>
          <label>
            Phone
            <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
          </label>
        </div>
      )}

      {current === 2 && (
        <div>
          <h3>Security</h3>
          <label>
            Password
            <input type="password" value={security.password} onChange={(e) => setSecurity({ ...security, password: e.target.value })} />
            {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
          </label>
          <PasswordStrengthMeter password={security.password} />
          <label>
            Confirm password
            <input type="password" value={security.passwordConfirm} onChange={(e) => setSecurity({ ...security, passwordConfirm: e.target.value })} />
            {errors.passwordConfirm && <div style={{ color: 'red' }}>{errors.passwordConfirm}</div>}
          </label>
          <div style={{ fontSize: 12, marginTop: 8 }}>
            Password must be at least 10 characters and include uppercase, lowercase, number and special character.
          </div>
        </div>
      )}

      {current === 3 && (
        <div>
          <h3>Preferences</h3>
          <label>
            Main city
            <input value={preferences.city} onChange={(e) => setPreferences({ ...preferences, city: e.target.value })} />
          </label>
          <label>
            Favorite complex (optional)
            <input value={preferences.favoriteComplex} onChange={(e) => setPreferences({ ...preferences, favoriteComplex: e.target.value })} />
          </label>
        </div>
      )}

      {current === 4 && (
        <div>
          <h3>Consents</h3>
          <label>
            <input type="checkbox" checked={consents.dataProcessing} onChange={(e) => setConsents({ ...consents, dataProcessing: e.target.checked })} />
            I consent to data processing (required)
            {errors.dataProcessing && <div style={{ color: 'red' }}>{errors.dataProcessing}</div>}
          </label>
          <label>
            <input type="checkbox" checked={consents.terms} onChange={(e) => setConsents({ ...consents, terms: e.target.checked })} />
            I accept the terms and conditions (required)
            {errors.terms && <div style={{ color: 'red' }}>{errors.terms}</div>}
          </label>
          <label>
            <input type="checkbox" checked={consents.marketing} onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })} />
            I agree to receive commercial communications (optional)
          </label>

          <CaptchaStub onVerify={(t) => setCaptchaToken(t)} />
          {errors.captcha && <div style={{ color: 'red' }}>{errors.captcha}</div>}
        </div>
      )}

      {current === 5 && (
        <div>
          <h3>Review</h3>
          <div>
            <strong>Name:</strong> {personal.firstName} {personal.lastName}
          </div>
          <div>
            <strong>Email:</strong> {contact.email}
          </div>
          <div>
            <strong>Phone:</strong> {contact.phone}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        {current > 0 && (
          <button type="button" onClick={() => goto(current - 1)} disabled={submitting}>
            Back
          </button>
        )}
        {current < steps.length - 1 && (
          <button
            type="button"
            onClick={() => {
              if (validateStep(current)) goto(current + 1)
            }}
            disabled={submitting}
          >
            Next
          </button>
        )}
        {current === steps.length - 1 && (
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Register'}
          </button>
        )}
      </div>

      {errors.form && <div style={{ color: 'red', marginTop: 12 }}>{errors.form}</div>}
    </form>
  )
}
