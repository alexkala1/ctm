import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { ZodSchema } from 'zod'

// Note: file-saver is for browser use only, server exports return data
import type {
  Tournament,
  Competitor,
  ImportResult,
} from '../../types/tournament'

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: AutoTableOptions): jsPDF
  }
}

interface AutoTableOptions {
  head?: string[][]
  body?: string[][]
  startY?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  pageBreak?: 'auto' | 'avoid' | 'always'
  rowPageBreak?: 'auto' | 'avoid'
  tableWidth?: 'auto' | 'wrap'
  showHead?: 'everyPage' | 'firstPage' | 'never'
  tableLineColor?: number | number[]
  tableLineWidth?: number
  styles?: Record<string, unknown>
  headStyles?: Record<string, unknown>
  bodyStyles?: Record<string, unknown>
  alternateRowStyles?: Record<string, unknown>
  columnStyles?: Record<string, unknown>
  didDrawPage?: (data: unknown) => void
  didParseCell?: (data: unknown) => void
  willDrawCell?: (data: unknown) => void
  didDrawCell?: (data: unknown) => void
}

export async function exportToCSV(
  data: Record<string, unknown>[],
  _filename: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const csv = Papa.unparse(data, {
      header: true,
      delimiter: ',',
    })

    return { success: true, data: csv }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('CSV export failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    }
  }
}

export async function exportToExcel(
  data: Record<string, unknown>[],
  _filename: string
): Promise<{ success: boolean; data?: ArrayBuffer; error?: string }> {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    return { success: true, data: excelBuffer }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Excel export failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    }
  }
}

export async function exportToPDF(
  data: Record<string, unknown>[],
  filename: string,
  title: string
): Promise<{ success: boolean; data?: Uint8Array; error?: string }> {
  try {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text(title, 14, 22)

    // Add data table
    const columns = Object.keys(data[0] || {})
    const rows = data.map((row) => columns.map((col) => row[col] || ''))

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
    })

    const pdfData = doc.output('arraybuffer')

    return { success: true, data: new Uint8Array(pdfData) }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('PDF export failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    }
  }
}

export async function importFromCSV(
  file: File,
  schema: ZodSchema
): Promise<ImportResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data } = results
        const importErrors: Array<{
          row: number
          field: string
          message: string
          value: unknown
        }> = []
        const warnings: Array<{
          row: number
          field: string
          message: string
          value: unknown
        }> = []

        // Validate each row
        data.forEach((row: unknown, index: number) => {
          if (typeof row === 'object' && row !== null) {
            const typedRow = row as Record<string, unknown>
            try {
              schema.parse(typedRow)
            } catch (error: unknown) {
              if (error && typeof error === 'object' && 'errors' in error) {
                const zodError = error as {
                  errors: Array<{
                    path: string[]
                    message: string
                    value: unknown
                  }>
                }
                zodError.errors.forEach((err) => {
                  importErrors.push({
                    row: index + 1,
                    field: err.path.join('.'),
                    message: err.message,
                    value: err.value,
                  })
                })
              }
            }
          }
        })

        resolve({
          success: importErrors.length === 0,
          imported: data.length - importErrors.length,
          errors: importErrors,
          warnings,
        })
      },
      error: (error) => {
        resolve({
          success: false,
          imported: 0,
          errors: [
            {
              row: 0,
              field: 'file',
              message: error.message,
              value: file.name,
            },
          ],
          warnings: [],
        })
      },
    })
  })
}

export async function importFromExcel(
  file: File,
  schema: ZodSchema
): Promise<ImportResult> {
  try {
    const workbook = XLSX.read(await file.arrayBuffer())
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const importErrors: Array<{
      row: number
      field: string
      message: string
      value: unknown
    }> = []
    const warnings: Array<{
      row: number
      field: string
      message: string
      value: unknown
    }> = []

    // Validate each row
    data.forEach((row: unknown, index: number) => {
      if (typeof row === 'object' && row !== null) {
        const typedRow = row as Record<string, unknown>
        try {
          schema.parse(typedRow)
        } catch (error: unknown) {
          if (error && typeof error === 'object' && 'errors' in error) {
            const zodError = error as {
              errors: Array<{ path: string[]; message: string; value: unknown }>
            }
            zodError.errors.forEach((err) => {
              importErrors.push({
                row: index + 1,
                field: err.path.join('.'),
                message: err.message,
                value: err.value,
              })
            })
          }
        }
      }
    })

    return {
      success: importErrors.length === 0,
      imported: data.length - importErrors.length,
      errors: importErrors,
      warnings,
    }
  } catch (error) {
    return {
      success: false,
      imported: 0,
      errors: [
        {
          row: 0,
          field: 'file',
          message: error instanceof Error ? error.message : 'Import failed',
          value: file.name,
        },
      ],
      warnings: [],
    }
  }
}

export function createTournamentExportData(
  tournaments: Tournament[]
): Record<string, unknown>[] {
  return tournaments.map((tournament) => ({
    'Tournament Name': tournament.name,
    Status: tournament.status,
    'Start Date': new Date(tournament.tournamentStart).toLocaleDateString(),
    'End Date': new Date(tournament.tournamentEnd).toLocaleDateString(),
    'Registration Start': new Date(
      tournament.tournamentRegistrationStart
    ).toLocaleDateString(),
    'Registration End': new Date(
      tournament.tournamentRegistrationEnd
    ).toLocaleDateString(),
    Categories: tournament.categories.join(', '),
    'Teams Allowed': tournament.hasTeams ? 'Yes' : 'No',
    'Created By': tournament.creator?.name || 'Unknown',
    'Created At': new Date(tournament.createdAt).toLocaleDateString(),
  }))
}

export function createCompetitorExportData(
  competitors: Competitor[]
): Record<string, unknown>[] {
  return competitors.map((competitor) => ({
    'Personal Number': competitor.personalNumber,
    'First Name': competitor.firstName,
    'Last Name': competitor.lastName,
    Gender: competitor.gender,
    Category: competitor.category,
    Team: competitor.team || '',
    Status: competitor.playerAcceptanceStatus,
    'Admin Notes': competitor.adminNotes || '',
    'Registered At': new Date(competitor.createdAt).toLocaleDateString(),
  }))
}

export function createCompetitorImportSchema() {
  return {
    type: 'object',
    required: ['firstName', 'lastName', 'gender', 'category'],
    properties: {
      firstName: { type: 'string', minLength: 2 },
      lastName: { type: 'string', minLength: 2 },
      gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
      category: { type: 'string', minLength: 1 },
      team: { type: 'string', nullable: true },
    },
  }
}

export function createTournamentImportSchema() {
  return {
    type: 'object',
    required: [
      'name',
      'tournamentStart',
      'tournamentEnd',
      'tournamentRegistrationStart',
      'tournamentRegistrationEnd',
    ],
    properties: {
      name: { type: 'string', minLength: 3 },
      tournamentStart: { type: 'string', format: 'date' },
      tournamentEnd: { type: 'string', format: 'date' },
      tournamentRegistrationStart: { type: 'string', format: 'date' },
      tournamentRegistrationEnd: { type: 'string', format: 'date' },
      categories: { type: 'array', items: { type: 'string' } },
      hasTeams: { type: 'boolean' },
    },
  }
}

export async function exportTournaments(
  tournaments: Tournament[],
  format: 'csv' | 'xlsx' | 'pdf',
  filename: string = 'tournaments'
): Promise<{ success: boolean; error?: string }> {
  const data = createTournamentExportData(tournaments)

  switch (format) {
    case 'csv':
      return exportToCSV(data, filename)
    case 'xlsx':
      return exportToExcel(data, filename)
    case 'pdf':
      return exportToPDF(data, filename, 'Tournaments Export')
    default:
      return { success: false, error: 'Unsupported format' }
  }
}

export async function exportCompetitors(
  competitors: Competitor[],
  format: 'csv' | 'xlsx' | 'pdf',
  filename: string = 'competitors'
): Promise<{
  success: boolean
  data?: string | ArrayBuffer | Uint8Array
  error?: string
}> {
  const data = createCompetitorExportData(competitors)

  switch (format) {
    case 'csv':
      return exportToCSV(data, filename)
    case 'xlsx':
      return exportToExcel(data, filename)
    case 'pdf':
      return exportToPDF(data, filename, 'Competitors Export')
    default:
      return { success: false, error: 'Unsupported format' }
  }
}

export function generateImportTemplate(
  type: 'tournament' | 'competitor'
): Record<string, unknown>[] {
  if (type === 'tournament') {
    return [
      {
        name: 'Sample Tournament',
        tournamentStart: '2024-01-01',
        tournamentEnd: '2024-01-03',
        tournamentRegistrationStart: '2023-12-01',
        tournamentRegistrationEnd: '2023-12-31',
        categories: 'Open,U18',
        hasTeams: false,
      },
    ]
  } else {
    return [
      {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        category: 'Open',
        team: 'Sample Team',
      },
    ]
  }
}

export function validateImportFile(file: File): {
  valid: boolean
  error?: string
} {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please use CSV or Excel files.',
    }
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit.' }
  }

  return { valid: true }
}
