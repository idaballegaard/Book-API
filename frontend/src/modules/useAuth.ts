import { API_BASE_URL } from '../config/api'

const AUTH_STORAGE_KEY = 'auth'

export interface AuthUser {
  id: string
  name: string
  email: string
  favoriteBooks?: string[]
}

interface AuthState {
  token: string
  user: AuthUser
}

interface LoginResponse {
  error: string | null
  data?: AuthState
}

interface RegisterResponse {
  error: string | null
  data?: string
}

export function getAuthState(): AuthState | null {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedAuth) {
    return null
  }

  try {
    return JSON.parse(storedAuth) as AuthState
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function getStoredUser(): AuthUser | null {
  return getAuthState()?.user ?? null
}

export function getAuthToken(): string | null {
  return getAuthState()?.token ?? null
}

export function isAuthenticated(): boolean {
  const authState = getAuthState()
  return Boolean(authState?.token && authState.user?.email)
}

export function clearAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const result = (await response.json()) as LoginResponse

  if (!response.ok || !result.data) {
    throw new Error(result.error || 'Unable to login')
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.data))
  return result.data.user
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })

  const result = (await response.json()) as RegisterResponse

  if (!response.ok || !result.data) {
    throw new Error(result.error || 'Unable to register')
  }

  return loginUser(email, password)
}
