import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, VerifyEmailResponse } from '../interfaces'

// Al usar '' en desarrollo local, pasa por el proxy de Vite configurado en vite.config.ts
const API_BASE = import.meta.env.VITE_API_BASE || ''

async function handleJsonResponse(res: Response) {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, ...(json || {}), status: res.status }
  }

  return { ok: true, ...(json || {}) }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  // 1. Contrato oficial con el backend
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  // 2. Si responde normalmente (backend real)
  if (res.status !== 404) {
    return handleJsonResponse(res) as Promise<RegisterResponse>
  }

  // Fallback para entorno local con json-server cuando /api/users devuelve 404
  try {
    const userEmail = payload.contact?.email

    if (userEmail) {
      const checkRes = await fetch(`${API_BASE}/api/users?email=${encodeURIComponent(userEmail)}`)
      const existing = await checkRes.json()
      if (Array.isArray(existing) && existing.length > 0) {
        return { ok: false, message: 'El correo electrónico ya se encuentra registrado.' } as unknown as RegisterResponse
      }
    }

    const saveRes = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        // Guardamos también en la raíz para compatibilidad directa con el login de json-server
        email: userEmail,
        password: payload.security?.password,
        name: `${payload.personal?.firstName || ''} ${payload.personal?.lastName || ''}`.trim(),
        token: `mock_jwt_token_${Date.now()}`,
      }),
    })
    return handleJsonResponse(saveRes) as Promise<RegisterResponse>
  } catch (error) {
    console.error('Error en mock register:', error)
    return { ok: false, message: 'No se pudo conectar con el servidor local.' } as unknown as RegisterResponse
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse & { accessToken?: string }> {
  // 1. Contrato oficial con el backend
  try {
    const res = await fetch(`${API_BASE}/api/users/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      const token = data.accessToken || data.token || null
      if (token) {
        localStorage.setItem('riwi:token', JSON.stringify(token))
        localStorage.setItem('accessToken', token)
      }
      if (data.user) {
        localStorage.setItem('riwi:user', JSON.stringify(data.user))
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return {
        ...data,
        ok: true,
        accessToken: token,
      }
    }

    if (res.status !== 404) {
      const errorData = await res.json().catch(() => ({}))
      return { ok: false, ...errorData, status: res.status }
    }
  } catch (netErr) {
    console.warn('[Auth] No fue posible contactar el backend real, recurriendo al mock:', netErr)
  }

  // 2. Fallback de desarrollo para json-server (cuando /api/users/auth da 404)
  try {
    const mockRes = await fetch(`${API_BASE}/api/users?email=${encodeURIComponent(payload.email)}`)
    if (!mockRes.ok) {
      return { ok: false, message: 'No se pudo consultar el servidor local.' } as LoginResponse
    }

    const users = await mockRes.json()
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null

    if (!user) {
      return { ok: false, message: 'No existe una cuenta registrada con este correo electrónico.' } as LoginResponse
    }

    if (user.password !== payload.password) {
      return { ok: false, message: 'Contraseña incorrecta.' } as LoginResponse
    }

    const token = user.token || user.accessToken || `token_mock_${Date.now()}`
    const storedUser = {
      name: user.name || (user.personal ? `${user.personal.firstName} ${user.personal.lastName}`.trim() : payload.email.split('@')[0]),
      email: payload.email,
      token,
    }

    // Guardar en las claves que escucha useAuth()
    localStorage.setItem('riwi:user', JSON.stringify(storedUser))
    localStorage.setItem('riwi:token', JSON.stringify(token))

    // Compatibilidad adicional
    localStorage.setItem('user', JSON.stringify(storedUser))
    localStorage.setItem('accessToken', token)

    return {
      ok: true,
      user: storedUser,
      accessToken: token,
    } as unknown as LoginResponse & { accessToken: string }
  } catch (err) {
    console.error('[Auth] Error procesando autenticación:', err)
    return { ok: false, message: 'Error inesperado al iniciar sesión.' } as LoginResponse
  }
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const res = await fetch(`${API_BASE}/api/users/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })

  if (res.status === 404) {
    return { ok: true, message: 'Correo verificado correctamente (simulado).' } as unknown as VerifyEmailResponse
  }

  return handleJsonResponse(res) as Promise<VerifyEmailResponse>
}

export async function createMembership(userId: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/api/users/membership`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  if (res.status === 404) {
    return { ok: true, message: 'Membresía activada con éxito (simulada).' }
  }

  return handleJsonResponse(res)
}