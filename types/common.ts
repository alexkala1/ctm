// Common types used across the application

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER'
export type TournamentStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'FINISHED'
export type Gender = 'MALE' | 'FEMALE'
export type PlayerAcceptanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FilterOptions {
  [key: string]: unknown
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}
