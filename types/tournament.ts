// Import Prisma generated enums
import type { TournamentStatus, Gender, PlayerAcceptanceStatus, UserRole } from '@prisma/client';
// Pagination is imported from api.ts but not used directly in this file
import type { User } from './auth';

// Re-export for convenience
export type { TournamentStatus, Gender, PlayerAcceptanceStatus, UserRole };

// Base Database Models (matching Prisma schema exactly)
// User interface is defined in auth.ts

export interface Tournament {
  id: string;
  name: string;
  status: TournamentStatus;
  tournamentStart: Date;
  tournamentEnd: Date;
  tournamentRegistrationStart: Date;
  tournamentRegistrationEnd: Date;
  proclamations: string | null;
  chessResults: string | null;
  categories: string[];
  hasTeams: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  competitors: Competitor[];
  creator: User | null;
}

export interface Competitor {
  id: string;
  tournamentId: string;
  personalNumber: number;
  firstName: string;
  lastName: string;
  ratedPlayerLinks: string[];
  gender: Gender;
  category: string;
  team: string | null;
  tournamentDocumentUrl: string | null;
  playerAcceptanceStatus: PlayerAcceptanceStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  tournament: Tournament;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  oldValue: unknown | null;
  newValue: unknown | null;
  changedBy: string;
  changedAt: Date;
  user: User;
}

// API Response Types (serialized dates as strings)
export interface UserApiResponse {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentApiResponse {
  id: string;
  name: string;
  status: TournamentStatus;
  tournamentStart: string;
  tournamentEnd: string;
  tournamentRegistrationStart: string;
  tournamentRegistrationEnd: string;
  proclamations: string | null;
  chessResults: string | null;
  categories: string[];
  hasTeams: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creator: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  competitors?: {
    id: string;
  }[];
}

export interface CompetitorApiResponse {
  id: string;
  tournamentId: string;
  personalNumber: number;
  firstName: string;
  lastName: string;
  ratedPlayerLinks: string[];
  gender: Gender;
  category: string;
  team: string | null;
  tournamentDocumentUrl: string | null;
  playerAcceptanceStatus: PlayerAcceptanceStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tournament: {
    id: string;
    name: string;
    status: TournamentStatus;
    hasTeams: boolean;
  };
}

// Detailed API Response Types (with relations)
export interface TournamentWithDetails extends TournamentApiResponse {
  creator: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  competitors: CompetitorApiResponse[];
}

export interface CompetitorWithDetails extends CompetitorApiResponse {
  tournament: {
    id: string;
    name: string;
    status: TournamentStatus;
    hasTeams: boolean;
  };
}

export interface UserWithDetails extends UserApiResponse {
  createdTournaments: TournamentApiResponse[];
}

// Form Input Types
export interface CreateTournamentInput {
  name: string;
  status: TournamentStatus;
  tournamentStart: string;
  tournamentEnd: string;
  tournamentRegistrationStart: string;
  tournamentRegistrationEnd: string;
  categories: string[];
  hasTeams: boolean;
  proclamations?: string | null;
  chessResults?: string | null;
}

export interface UpdateTournamentInput extends Partial<CreateTournamentInput> {
  id: string;
}

export interface CreateCompetitorInput {
  firstName: string;
  lastName: string;
  gender: Gender;
  category: string;
  team?: string | null;
  ratedPlayerLinks?: string[];
  tournamentDocumentUrl?: string | null;
  playerAcceptanceStatus?: PlayerAcceptanceStatus;
  adminNotes?: string | null;
  tournamentId: string;
}

export interface UpdateCompetitorInput extends Partial<CreateCompetitorInput> {
  id: string;
}

export interface CreateUserInput {
  email: string;
  name?: string | null;
  role: UserRole;
  password?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}

// Entity Type Enums
export enum EntityType {
  TOURNAMENT = 'tournament',
  COMPETITOR = 'competitor',
  USER = 'user',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
}

// Filter Types - using TournamentFilters from forms.ts

// CompetitorFilters is defined in forms.ts

// UserFilters is defined in forms.ts

// Sort Types - using SortOptions from forms.ts

// Table Types - using TableColumn from forms.ts

// Pagination Types - using Pagination from api.ts

// Bulk Action Types
export interface BulkAction {
  action: 'approve' | 'reject' | 'delete' | 'export';
  ids: string[];
  data?: unknown;
}

// Dashboard Stats
// DashboardStats is defined in ui.ts

// File Upload Types
export interface FileUpload {
  file: File;
  type: 'tournament_document' | 'proclamation' | 'chess_results';
  tournamentId?: string;
  competitorId?: string;
}

// Import/Export Types - using ImportResult from forms.ts

// ImportError, ImportWarning, and ImportResult are defined in forms.ts

// ExportOptions is defined in forms.ts

// Email Notification Types - using EmailNotification from forms.ts

// Type Guards
export function isTournamentStatus(value: unknown): value is TournamentStatus {
  return typeof value === 'string' && ['DRAFT', 'OPEN', 'IN_PROGRESS', 'FINISHED'].includes(value);
}

export function isGender(value: unknown): value is Gender {
  return typeof value === 'string' && ['MALE', 'FEMALE'].includes(value);
}

export function isPlayerAcceptanceStatus(value: unknown): value is PlayerAcceptanceStatus {
  return typeof value === 'string' && ['PENDING', 'APPROVED', 'REJECTED'].includes(value);
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && ['SUPER_ADMIN', 'ADMIN', 'USER'].includes(value);
}

// Utility Types
export type TournamentStatusKey = keyof typeof TournamentStatus;
export type GenderKey = keyof typeof Gender;
export type PlayerAcceptanceStatusKey = keyof typeof PlayerAcceptanceStatus;
export type UserRoleKey = keyof typeof UserRole;

// API Response Wrappers
export type TournamentListResponse = TournamentApiResponse[];
export type CompetitorListResponse = CompetitorApiResponse[];
export type UserListResponse = UserApiResponse[];

// Component Props Types
export interface TournamentCardProps {
  tournament: TournamentApiResponse;
  isAdmin?: boolean;
  onEdit?: (tournament: TournamentApiResponse) => void;
  onDelete?: (tournament: TournamentApiResponse) => void;
  onView?: (tournament: TournamentApiResponse) => void;
}

export interface CompetitorCardProps {
  competitor: CompetitorApiResponse;
  isAdmin?: boolean;
  onEdit?: (competitor: CompetitorApiResponse) => void;
  onDelete?: (competitor: CompetitorApiResponse) => void;
  onView?: (competitor: CompetitorApiResponse) => void;
}

export interface UserCardProps {
  user: UserApiResponse;
  isAdmin?: boolean;
  onEdit?: (user: UserApiResponse) => void;
  onDelete?: (user: UserApiResponse) => void;
  onView?: (user: UserApiResponse) => void;
}
