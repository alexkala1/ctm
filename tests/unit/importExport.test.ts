import { describe, it, expect } from 'vitest'

import {
  createCompetitorExportData,
  createCompetitorImportSchema,
  validateImportFile,
  generateImportTemplate,
} from '../../server/utils/importExport'

describe('Import/Export Utilities', () => {
  describe('createCompetitorExportData', () => {
    it('should create export data with correct structure', () => {
      const competitors = [
        {
          id: '1',
          tournamentId: 'tournament-1',
          personalNumber: 1,
          firstName: 'John',
          lastName: 'Doe',
          gender: 'MALE' as const,
          category: 'Open',
          team: 'Team A',
          playerAcceptanceStatus: 'PENDING' as const,
          adminNotes: 'Test notes',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      const result = createCompetitorExportData(competitors)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        'Personal Number': 1,
        'First Name': 'John',
        'Last Name': 'Doe',
        Gender: 'MALE',
        Category: 'Open',
        Team: 'Team A',
        Status: 'PENDING',
        'Admin Notes': 'Test notes',
        'Registered At': '1/1/2024',
      })
    })

    it('should handle null/undefined values correctly', () => {
      const competitors = [
        {
          id: '1',
          tournamentId: 'tournament-1',
          personalNumber: 1,
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'FEMALE' as const,
          category: 'U18',
          team: null,
          playerAcceptanceStatus: 'APPROVED' as const,
          adminNotes: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      const result = createCompetitorExportData(competitors)

      expect(result[0]).toEqual({
        'Personal Number': 1,
        'First Name': 'Jane',
        'Last Name': 'Smith',
        Gender: 'FEMALE',
        Category: 'U18',
        Team: '',
        Status: 'APPROVED',
        'Admin Notes': '',
        'Registered At': '1/1/2024',
      })
    })
  })

  describe('createCompetitorImportSchema', () => {
    it('should return correct schema structure', () => {
      const schema = createCompetitorImportSchema()

      expect(schema).toEqual({
        type: 'object',
        required: ['firstName', 'lastName', 'gender', 'category'],
        properties: {
          firstName: { type: 'string', minLength: 2 },
          lastName: { type: 'string', minLength: 2 },
          gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
          category: { type: 'string', minLength: 1 },
          team: { type: 'string', nullable: true },
        },
      })
    })
  })

  describe('validateImportFile', () => {
    it('should accept valid CSV files', () => {
      const file = new File(['test'], 'test.csv', { type: 'text/csv' })
      const result = validateImportFile(file)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid Excel files', () => {
      const file = new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const result = validateImportFile(file)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid file types', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateImportFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('File type not supported')
    })

    it('should reject files that are too large', () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024) // 11MB
      const file = new File([largeContent], 'test.csv', { type: 'text/csv' })
      const result = validateImportFile(file)

      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size exceeds 10MB limit')
    })
  })

  describe('generateImportTemplate', () => {
    it('should generate competitor template with correct structure', () => {
      const template = generateImportTemplate('competitor')

      expect(template).toHaveLength(1)
      expect(template[0]).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        category: 'Open',
        team: 'Sample Team',
      })
    })

    it('should generate tournament template with correct structure', () => {
      const template = generateImportTemplate('tournament')

      expect(template).toHaveLength(1)
      expect(template[0]).toEqual({
        name: 'Sample Tournament',
        tournamentStart: '2024-01-01',
        tournamentEnd: '2024-01-03',
        tournamentRegistrationStart: '2023-12-01',
        tournamentRegistrationEnd: '2023-12-31',
        categories: 'Open,U18',
        hasTeams: false,
      })
    })
  })
})
