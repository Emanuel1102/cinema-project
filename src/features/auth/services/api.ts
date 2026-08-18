import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, VerifyEmailResponse } from '../interfaces'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

async function handleJsonResponse(res: Response) {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, ...(json || {}), status: res.status }
  }

  return { ok: true, ...(json || {}) }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleJsonResponse(res)
}

export async function login(payload: LoginPayload): Promise<LoginResponse & { accessToken?: string }> {
  const res = await fetch(`${API_BASE}/api/users/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await handleJsonResponse(res)
  if (!data.ok && !data.accessToken) {
    return data as LoginResponse
  }

  return {
    ...data,
    ok: true,
    accessToken: data.accessToken || data.token || null,
  }
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const res = await fetch(`${API_BASE}/api/users/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return handleJsonResponse(res)
}

export async function createMembership(userId: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/api/users/membership`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  return handleJsonResponse(res)
}
