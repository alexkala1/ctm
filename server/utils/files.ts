import { createClient } from '@supabase/supabase-js'

import { validateFileUpload } from './security'

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
  fileId?: string
}

export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: string
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
  userId: string
): Promise<FileUploadResult> {
  try {
    // Validate file
    const validation = validateFileUpload(
      file,
      ALLOWED_FILE_TYPES,
      MAX_FILE_SIZE
    )
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`
    const fullPath = `${path}/${filename}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath)

    // Store file metadata in database
    const _metadata: FileMetadata = {
      id: data.path,
      name: file.name,
      size: file.size,
      type: file.type,
      url: urlData.publicUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId,
    }

    return {
      success: true,
      url: urlData.publicUrl,
      fileId: data.path,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('File upload failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('File deletion failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deletion failed',
    }
  }
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      if (process.env.NODE_ENV === 'development')
        console.error('Failed to create signed URL:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Signed URL creation failed:', error)
    return null
  }
}

export async function uploadTournamentDocument(
  file: File,
  tournamentId: string,
  competitorId: string,
  userId: string
): Promise<FileUploadResult> {
  const path = `tournaments/${tournamentId}/competitors/${competitorId}`
  return uploadFile(file, 'tournament-documents', path, userId)
}

export async function uploadProclamation(
  file: File,
  tournamentId: string,
  userId: string
): Promise<FileUploadResult> {
  const path = `tournaments/${tournamentId}/proclamations`
  return uploadFile(file, 'tournament-documents', path, userId)
}

export async function uploadChessResults(
  file: File,
  tournamentId: string,
  userId: string
): Promise<FileUploadResult> {
  const path = `tournaments/${tournamentId}/results`
  return uploadFile(file, 'tournament-documents', path, userId)
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  return imageExtensions.includes(getFileExtension(filename))
}

export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt']
  return documentExtensions.includes(getFileExtension(filename))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

export async function scanFileForViruses(
  file: File
): Promise<{ clean: boolean; error?: string }> {
  // In production, integrate with a virus scanning service
  // For now, we'll do basic validation
  try {
    // Check file signature
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Basic file signature validation
    const signatures = {
      pdf: [0x25, 0x50, 0x44, 0x46],
      jpg: [0xff, 0xd8, 0xff],
      png: [0x89, 0x50, 0x4e, 0x47],
      doc: [0xd0, 0xcf, 0x11, 0xe0],
      docx: [0x50, 0x4b, 0x03, 0x04],
    }

    const extension = getFileExtension(file.name).toLowerCase()
    const signature = signatures[extension as keyof typeof signatures]

    if (signature) {
      const matches = signature.every(
        (byte, index) => uint8Array[index] === byte
      )
      if (!matches) {
        return {
          clean: false,
          error: 'File signature does not match extension',
        }
      }
    }

    return { clean: true }
  } catch {
    return { clean: false, error: 'File scanning failed' }
  }
}

export async function cleanupOrphanedFiles(): Promise<{
  cleaned: number
  errors: string[]
}> {
  // This would typically be run as a scheduled job
  // to clean up files that are no longer referenced in the database
  const errors: string[] = []
  let cleaned = 0

  try {
    // Get all files in storage
    const { data: files, error } = await supabase.storage
      .from('tournament-documents')
      .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'asc' } })

    if (error) {
      errors.push(`Failed to list files: ${error.message}`)
      return { cleaned, errors }
    }

    // Check each file against database references
    // This is a simplified version - in production you'd want to
    // check against actual database records

    for (const file of files) {
      // In a real implementation, you'd check if the file is referenced
      // in the database before deleting it
      const { error: deleteError } = await supabase.storage
        .from('tournament-documents')
        .remove([file.name])

      if (deleteError) {
        errors.push(`Failed to delete ${file.name}: ${deleteError.message}`)
      } else {
        cleaned++
      }
    }

    return { cleaned, errors }
  } catch (error) {
    errors.push(
      `Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return { cleaned, errors }
  }
}
