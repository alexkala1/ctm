// Store-specific types
import type { User, TournamentApiResponse, CompetitorApiResponse } from './index';
import type { ApiResponse, ApiError, PaginatedResponse, Pagination } from './api';

// ============================================================================
// AUTH STORE TYPES
// ============================================================================

export interface AuthUserResponse {
  user: User;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthUserResult extends AuthResult {
  user?: User;
}

// ============================================================================
// TOURNAMENT STORE TYPES
// ============================================================================

export interface TournamentsListData {
  tournaments: TournamentApiResponse[];
}

export interface TournamentData {
  tournament: TournamentApiResponse;
}

export interface TournamentResult extends AuthResult {
  tournament?: TournamentApiResponse;
}

// ============================================================================
// COMPETITOR STORE TYPES
// ============================================================================

export interface CompetitorsListData {
  competitors: CompetitorApiResponse[];
}

export interface CompetitorData {
  competitor: CompetitorApiResponse;
}

export interface CompetitorResult extends AuthResult {
  competitor?: CompetitorApiResponse;
}

// ============================================================================
// USER STORE TYPES
// ============================================================================

export interface UserData {
  user: User;
}

export interface UserResult extends AuthResult {
  user?: User;
}

export interface BulkActionResult extends AuthResult {
  results?: BulkActionResultItem[];
}

export interface BulkActionResultItem {
  userId: string;
  email: string;
  success: boolean;
  action: 'delete' | 'approve' | 'reject' | 'suspend' | 'activate';
}

export interface BulkActionError {
  userId: string;
  email: string;
  error: string;
}

export interface BulkActionSummary {
  total: number;
  successful: number;
  failed: number;
}

export interface BulkActionData {
  results: BulkActionResultItem[];
  errors: BulkActionError[];
  summary: BulkActionSummary;
}

// ============================================================================
// UI STORE TYPES
// ============================================================================

// Notification types are defined in types/ui.ts

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface ErrorWithMessage {
  message?: string;
}

export interface ApiErrorWithMessage extends ApiError {
  data?: ErrorWithMessage;
}

// ============================================================================
// STORE STATE TYPES
// ============================================================================

export interface BaseStoreState {
  isLoading: boolean;
  error: string | null;
}

export interface ListStoreState<T> extends BaseStoreState {
  items: T[];
}

export interface PaginatedStoreState<T> extends ListStoreState<T> {
  pagination: Pagination;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export type AuthApiResponse = ApiResponse<AuthUserResponse>;
export type TournamentsApiResponse = ApiResponse<TournamentsListData>;
export type SingleTournamentApiResponse = ApiResponse<TournamentData>;
export type CompetitorsApiResponse = ApiResponse<CompetitorsListData>;
export type SingleCompetitorApiResponse = ApiResponse<CompetitorData>;
export type UsersApiResponse = PaginatedResponse<User>;
export type UserApiResponseData = ApiResponse<UserData>;
export type BulkActionApiResponse = ApiResponse<BulkActionData>;
export type EmptyApiResponse = ApiResponse<Record<string, never>>;
