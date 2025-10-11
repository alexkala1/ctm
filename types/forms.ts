import type {
  TournamentStatus,
  Gender,
  PlayerAcceptanceStatus,
  UserRole,
} from '@prisma/client'

// Form Data Types
export interface CreateTournamentFormData {
  name: string
  status: TournamentStatus
  tournamentStart: string
  tournamentEnd: string
  tournamentRegistrationStart: string
  tournamentRegistrationEnd: string
  categories: string[]
  hasTeams: boolean
  proclamations?: string | null
  chessResults?: string | null
}

export interface UpdateTournamentFormData
  extends Partial<CreateTournamentFormData> {
  id: string
}

export interface CreateCompetitorFormData {
  firstName: string
  lastName: string
  gender: Gender
  category: string
  team?: string | null
  ratedPlayerLinks?: string
  tournamentDocumentUrl?: string | null
  playerAcceptanceStatus?: PlayerAcceptanceStatus
  adminNotes?: string | null
  tournamentId: string
}

export interface UpdateCompetitorFormData
  extends Partial<CreateCompetitorFormData> {
  id: string
}

export interface CreateUserFormData {
  email: string
  name?: string | null
  role: UserRole
  password?: string
}

export interface UpdateUserFormData extends Partial<CreateUserFormData> {
  id: string
}

// Form Validation Types
export interface FormFieldError {
  field: string
  message: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: FormFieldError[]
}

// Form State Types
export interface FormState<T> {
  data: T
  errors: Record<string, string>
  isSubmitting: boolean
  isDirty: boolean
  isValid: boolean
}

// Select Options Types
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
}

export interface RadioGroupOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
}

// Filter Types
export interface TournamentFilters {
  search?: string
  status?: TournamentStatus
  category?: string
  dateFrom?: string
  dateTo?: string
  hasTeams?: boolean
  createdBy?: string
}

export interface CompetitorFilters {
  search?: string
  category?: string
  gender?: Gender
  status?: PlayerAcceptanceStatus
  team?: string
  tournamentId?: string
}

export interface UserFilters {
  search?: string
  role?: UserRole
  status?: 'active' | 'inactive'
}

// Sort Types
export interface SortOptions {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  sortFn?: (a: unknown, b: unknown) => number
  width?: string
  align?: 'left' | 'center' | 'right'
}

// Import/Export Types
export interface ImportResult {
  success: boolean
  imported: number
  errors: ImportError[]
  warnings: ImportWarning[]
}

export interface ImportError {
  row: number
  field: string
  message: string
  value: unknown
}

export interface ImportWarning {
  row: number
  field: string
  message: string
  value: unknown
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf'
  fields: string[]
  filters?: Record<string, unknown>
  sort?: SortOptions
}

// Notification Types
export interface EmailNotification {
  to: string
  subject: string
  template: string
  data: Record<string, unknown>
}

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}
