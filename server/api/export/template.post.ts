import { generateImportTemplate } from '../../utils/importExport'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { type = 'competitor', format = 'csv' } = body

    if (!['tournament', 'competitor'].includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Invalid template type. Must be "tournament" or "competitor"',
      })
    }

    if (!['csv', 'xlsx'].includes(format)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid format. Must be "csv" or "xlsx"',
      })
    }

    const templateData = generateImportTemplate(
      type as 'tournament' | 'competitor'
    )

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = Object.keys(templateData[0])
      const csvRows = templateData.map((row) =>
        csvHeaders.map((header) => `"${row[header] || ''}"`).join(',')
      )
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')

      return {
        success: true,
        data: csvContent,
        contentType: 'text/csv',
        filename: `${type}_template.csv`,
      }
    } else {
      // Generate Excel (XLSX)
      const XLSX = await import('xlsx')
      const worksheet = XLSX.utils.json_to_sheet(templateData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      return {
        success: true,
        data: Buffer.from(excelBuffer).toString('base64'),
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `${type}_template.xlsx`,
      }
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
       
      console.error('Template generation error:', error)
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
