
/**
 * Interfaces for the registration feature (HU-FE-006).
 * All types are documented concisely for frontend usage.
 */

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say' | ''

/** Personal information collected in the first step */
export interface PersonalInfo {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  birthDate: string // ISO date (YYYY-MM-DD)
  gender?: Gender
}

/** Contact information collected in the contact step */
export interface ContactInfo {
  email: string
  emailConfirm: string
  phone: string
}

/** Security information (passwords) */
export interface SecurityInfo {
  password: string
  passwordConfirm: string
}

/** User preferences (optional fields allowed) */
export interface Preferences {
  city: string
  favoriteComplex?: string
}

/** Required/optional consents */
export interface Consents {
  dataProcessing: boolean
  terms: boolean
  marketing?: boolean
}

/** Payload sent to POST /auth/register */
export interface RegisterPayload {
  personal: PersonalInfo
  contact: ContactInfo
  security: SecurityInfo
  preferences: Preferences
  consents: Consents
  captchaToken?: string
}

/** API error object returned by backend (field optional) */
export interface ApiError {
  field?: string
  message: string
}

/** Register response from backend */
export interface RegisterResponse {
  ok: boolean
  message?: string
  errors?: ApiError[]
}

/** Verify email response from backend */
export interface VerifyEmailResponse {
  ok: boolean
  message?: string
}
