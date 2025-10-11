import type { UserRole, BaseEntity } from './common'
import type { Tournament, AuditLog } from './tournament'

export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'GITHUB'

export interface User extends BaseEntity {
  email: string
  name?: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  provider: AuthProvider
  providerId?: string
  lastLoginAt?: Date
  approvedAt?: Date
  createdTournaments?: Tournament[]
  auditLogs?: AuditLog[]
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  provider: AuthProvider
  lastLoginAt?: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
  role?: UserRole
}

export interface OAuthRegisterData {
  email: string
  name?: string
  avatarUrl?: string
  provider: AuthProvider
  providerId: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}
