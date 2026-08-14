import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, VerifyEmailResponse } from '../interfaces'

// Base URL for the backend API. Configure `VITE_API_BASE` in your env when needed.
const API_BASE = import.meta.env.VITE_API_BASE || ''

/**
 * Helper to normalize JSON responses from the backend.
 * Returns `{ ok: boolean, ...json }` and includes `status` when non-ok.
 */
async function handleJsonResponse(res: Response) {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, ...(json || {}), status: res.status }
  }
  return { ok: true, ...(json || {}) }
}

/** POST /auth/register - send register payload */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return handleJsonResponse(res)
}

/** POST /auth/login - authenticate user credentials */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return handleJsonResponse(res)
}

/** POST /auth/verify-email - verify an activation token */
export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const res = await fetch(`${API_BASE}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token }),
  })
  return handleJsonResponse(res)
}

/** POST /membership/create - optional call to create a default membership */
export async function createMembership(userId: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/membership/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId }),
  })
  return handleJsonResponse(res)
}
