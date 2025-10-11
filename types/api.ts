// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    data: T[]
    pagination: Pagination
  }
  message?: string
  error?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// API Error Types
export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: {
    message?: string
    error?: string
    details?: unknown
  }
}

// API Request Types
export interface CreateRequest<T> {
  data: T
}

export interface UpdateRequest<T> {
  id: string
  data: Partial<T>
}

export interface DeleteRequest {
  id: string
}

export interface BulkActionRequest {
  action: 'approve' | 'reject' | 'delete' | 'export'
  ids: string[]
  data?: unknown
}

// Query Parameters
export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean
  data: {
    url: string
    filename: string
    size: number
    type: string
  }
  message?: string
}

export interface FileUploadRequest {
  file: File
  type: 'tournament_document' | 'proclamation' | 'chess_results'
  tournamentId?: string
  competitorId?: string
}
