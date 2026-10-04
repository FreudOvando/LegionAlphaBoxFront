export type UserRole = 'ADMIN' | 'ATHLETE'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
  photoUrl?: string | null
  monthlyFee?: number | null
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
  photoUrl?: string | null
  monthlyFee?: number | null
  notes?: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  birthDate: string
  email: string
  password: string
  photoUrl: string | null
}

export interface AuthResponse {
  token: string
  user: User
}