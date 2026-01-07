import { z } from 'zod';

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const tournamentStatusSchema = z.enum(['DRAFT', 'OPEN', 'IN_PROGRESS', 'FINISHED']);
export const genderSchema = z.enum(['MALE', 'FEMALE']);
export const playerAcceptanceStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export const userRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']);

// Tournament validation schemas
export const createTournamentSchema = z
  .object({
    name: z.string().min(1, 'Tournament name is required').max(255),
    tournamentStart: z.coerce.date(),
    tournamentEnd: z.coerce.date(),
    tournamentRegistrationStart: z.coerce.date(),
    tournamentRegistrationEnd: z.coerce.date(),
    proclamations: z.string().url().optional().or(z.literal('')),
    chessResults: z.string().url().optional().or(z.literal('')),
    categories: z.array(z.string().min(1)).min(1, 'At least one category is required'),
    hasTeams: z.boolean().default(false),
  })
  .refine(data => data.tournamentRegistrationEnd < data.tournamentStart, {
    message: 'Registration end must be before tournament start',
    path: ['tournamentRegistrationEnd'],
  })
  .refine(data => data.tournamentStart < data.tournamentEnd, {
    message: 'Tournament start must be before tournament end',
    path: ['tournamentStart'],
  });

export const updateTournamentSchema = createTournamentSchema.partial().extend({
  status: tournamentStatusSchema.optional(),
});

export const tournamentFiltersSchema = z.object({
  status: z.array(tournamentStatusSchema).optional(),
  categories: z.array(z.string()).optional(),
  hasTeams: z.boolean().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().optional(),
});

// Competitor validation schemas
export const createCompetitorSchema = z.object({
  tournamentId: z.string().min(1, 'Tournament ID is required'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  ratedPlayerLinks: z.array(z.string().url()).default([]),
  gender: genderSchema,
  category: z.string().min(1, 'Category is required'),
  team: z.string().max(100).optional(),
  school: z.string().max(100).optional(),
  tournamentDocumentUrl: z.string().url().optional().or(z.literal('')),
  adminNotes: z.string().max(1000).optional(),
});

export const updateCompetitorSchema = createCompetitorSchema.partial().extend({
  playerAcceptanceStatus: playerAcceptanceStatusSchema.optional(),
});

export const competitorFiltersSchema = z.object({
  tournamentId: z.string().optional(),
  status: z.array(playerAcceptanceStatusSchema).optional(),
  categories: z.array(z.string()).optional(),
  gender: z.array(genderSchema).optional(),
  teams: z.array(z.string()).optional(),
  schools: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export const bulkActionSchema = z.object({
  competitorIds: z.array(z.string()).min(1, 'At least one competitor must be selected'),
  action: z.enum(['approve', 'reject', 'delete']),
  adminNotes: z.string().max(1000).optional(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character'),
  name: z.string().min(1, 'Name is required').max(100).optional(),
  role: userRoleSchema.default('USER'),
});

// Export validation schemas
export const tournamentListSchema = paginationSchema.merge(tournamentFiltersSchema);
export const competitorListSchema = paginationSchema.merge(competitorFiltersSchema);
