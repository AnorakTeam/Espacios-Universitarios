import { getAccessToken, clearSession } from './authStorage'

const BASE_URL = process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:8080'

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Si el token expiró, limpiar sesión
  if (res.status === 401) {
    clearSession()
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.error ||
      Object.values(data).flat().join(' ') ||
      `Error ${res.status}`
    throw new Error(message)
  }

  return data
}

// Auth endpoints
export const authApi = {
  login: (login, password) =>
    request('/api/v1/auth/login/', { method: 'POST', body: { login, password } }),

  register: (payload) =>
    request('/api/v1/auth/register/', { method: 'POST', body: payload }),

  logout: (refreshToken) =>
    request('/api/v1/auth/logout/', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      auth: true,
    }),
}

// Users endpoints
export const usersApi = {
  me: () => request('/api/v1/users/me/', { auth: true }),
  updateMe: (payload) =>
    request('/api/v1/users/me/', { method: 'PATCH', body: payload, auth: true }),
}
