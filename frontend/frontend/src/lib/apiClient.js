import { getAccessToken, clearSession } from './authStorage'

const USERS_URL = process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:8080'
const SPACES_URL = process.env.NEXT_PUBLIC_SPACES_API_URL || 'http://localhost:8082'

async function request(baseUrl, path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${baseUrl}${path}`, {
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

// Helpers internos
const usersReq = (path, opts) => request(USERS_URL, path, opts)
const spacesReq = (path, opts) => request(SPACES_URL, path, opts)

// ---------------------------------------------------------------------------
// Auth — HU-01, 02, 03, 04
// ---------------------------------------------------------------------------
export const authApi = {
  login: (login, password) =>
    usersReq('/api/v1/auth/login/', { method: 'POST', body: { login, password } }),

  register: (payload) =>
    usersReq('/api/v1/auth/register/', { method: 'POST', body: payload }),

  logout: (refreshToken) =>
    usersReq('/api/v1/auth/logout/', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      auth: true,
    }),

  // HU-04
  forgotPassword: (email) =>
    usersReq('/api/v1/auth/password-recovery/', { method: 'POST', body: { email } }),

  resetPassword: (token, newPassword) =>
    usersReq('/api/v1/auth/reset-password/', {
      method: 'POST',
      body: { token, new_password: newPassword },
    }),
}

// ---------------------------------------------------------------------------
// Perfil — HU-05
// ---------------------------------------------------------------------------
export const usersApi = {
  me: () => usersReq('/api/v1/users/me/', { auth: true }),

  updateMe: (payload) =>
    usersReq('/api/v1/users/me/', { method: 'PATCH', body: payload, auth: true }),
}

// ---------------------------------------------------------------------------
// Admin — usuarios (HU-16, 17, 18, 19)
// ---------------------------------------------------------------------------
export const adminUsersApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return usersReq(`/api/v1/admin/users/${qs ? `?${qs}` : ''}`, { auth: true })
  },

  create: (payload) =>
    usersReq('/api/v1/admin/users/', { method: 'POST', body: payload, auth: true }),

  get: (id) => usersReq(`/api/v1/admin/users/${id}/`, { auth: true }),

  update: (id, payload) =>
    usersReq(`/api/v1/admin/users/${id}/`, {
      method: 'PATCH',
      body: payload,
      auth: true,
    }),

  deactivate: (id) =>
    usersReq(`/api/v1/admin/users/${id}/`, { method: 'DELETE', auth: true }),
}

// ---------------------------------------------------------------------------
// Admin — espacios (HU-20, 21, 22, 23)
// ---------------------------------------------------------------------------
export const spacesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return spacesReq(`/api/v1/spaces/${qs ? `?${qs}` : ''}`, { auth: true })
  },

  create: (payload) =>
    spacesReq('/api/v1/spaces/', { method: 'POST', body: payload, auth: true }),

  get: (id) => spacesReq(`/api/v1/spaces/${id}/`, { auth: true }),

  update: (id, payload) =>
    spacesReq(`/api/v1/spaces/${id}/`, {
      method: 'PATCH',
      body: payload,
      auth: true,
    }),

  delete: (id) =>
    spacesReq(`/api/v1/spaces/${id}/`, { method: 'DELETE', auth: true }),

  // Áreas
  listAreas: () => spacesReq('/api/v1/areas/', { auth: true }),
  createArea: (payload) =>
    spacesReq('/api/v1/areas/', { method: 'POST', body: payload, auth: true }),

  // HU-25 — Horarios
  getHorarios: (spaceId) =>
    spacesReq(`/api/v1/spaces/${spaceId}/horarios/`, { auth: true }),

  replaceHorarios: (spaceId, horarios) =>
    spacesReq(`/api/v1/spaces/${spaceId}/horarios/`, {
      method: 'PUT',
      body: horarios,
      auth: true,
    }),

  updateHorario: (spaceId, horarioId, payload) =>
    spacesReq(`/api/v1/spaces/${spaceId}/horarios/${horarioId}/`, {
      method: 'PATCH',
      body: payload,
      auth: true,
    }),

  deleteHorario: (spaceId, horarioId) =>
    spacesReq(`/api/v1/spaces/${spaceId}/horarios/${horarioId}/`, {
      method: 'DELETE',
      auth: true,
    }),
}
