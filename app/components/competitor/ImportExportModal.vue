<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-3">
      <div
        class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg"
      >
        <Icon
          :name="
            isImport ? 'i-heroicons-arrow-down-tray' : 'i-heroicons-arrow-up-tray'
          "
          class="w-6 h-6 text-white"
        />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isImport ? 'Import Participants' : 'Export Participants' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{
            isImport
              ? 'Upload participant data from a file'
              : 'Download participant data to a file'
          }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <div class="space-y-8">
        <!-- Import Section -->
        <div v-if="isImport" class="space-y-6">
          <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div class="flex">
              <Icon
                name="i-heroicons-information-circle"
                class="w-5 h-5 text-blue-400 mr-4"
              />
              <div class="text-sm text-blue-700 dark:text-blue-300">
                <p class="font-medium mb-1">Import Instructions:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Use CSV or Excel (.xlsx) files</li>
                  <li>
                    Required columns: First Name, Last Name, Gender, Category
                  </li>
                  <li>Optional columns: Team, Admin Notes</li>
                  <li>Gender must be MALE or FEMALE</li>
                  <li>Category must match tournament categories</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- File Upload -->
          <div class="space-y-3">
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select File
              </label>
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                :class="{
                  'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragOver,
                  'border-red-400 bg-red-50 dark:bg-red-900/20': fileError,
                }"
                @drop="handleFileDrop"
                @dragover.prevent
                @dragenter.prevent
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  class="hidden"
                  @change="handleFileSelect"
                >
                <div v-if="!selectedFile" class="py-4">
                  <Icon
                    name="i-heroicons-cloud-arrow-up"
                    class="w-10 h-10 text-gray-400 dark:text-gray-500"
                  />
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop your file here, or
                    <UButton
                      variant="link"
                      size="sm"
                      class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      @click="() => fileInput?.click()"
                    >
                      browse files
                    </UButton>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    CSV, XLSX files up to 10MB
                  </p>
                </div>
                <div v-else>
                  <Icon
                    name="i-heroicons-document"
                    class="w-8 h-8 text-green-500"
                  />
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    {{ formatFileSize(selectedFile.size) }}
                  </p>
                  <UButton
                    variant="ghost"
                    size="sm"
                    color="error"
                    @click="removeFile"
                  >
                    Remove
                  </UButton>
                </div>
              </div>
              <UAlert
                v-if="fileError"
                color="error"
                variant="soft"
                :title="fileError"
              />
            </div>
          </div>

          <!-- Download Template -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg px-6 py-4">
            <div class="flex items-center justify-between w-full">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Need a template?
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Download our sample file to see the correct format
                </p>
              </div>
              <UButton variant="outline" size="sm" @click="downloadTemplate">
                <Icon name="i-heroicons-arrow-down-tray" class="w-6 h-6 mr-2" />
                Download Template
              </UButton>
            </div>
          </div>
        </div>

        <!-- Export Section -->
        <div v-else class="space-y-6">
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5"
          >
            <div class="flex p-4">
              <Icon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-green-400 mr-4"
              />
              <div class="text-sm text-green-700 dark:text-green-300">
                <p class="font-medium mb-1">Export Information:</p>
                <p>
                  Export all participants from this tournament in your preferred
                  format.
                </p>
              </div>
            </div>
          </div>

          <!-- Export Format Selection -->
          <div class="space-y-3">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Export Format
            </label>
            <div class="grid grid-cols-3 gap-4">
              <UButton
                v-for="format in exportFormats"
                :key="format.value"
                :variant="selectedFormat === format.value ? 'solid' : 'outline'"
                :color="selectedFormat === format.value ? 'primary' : 'neutral'"
                class="p-4 h-auto flex flex-col items-center space-y-3"
                @click="selectedFormat = format.value"
              >
                <Icon :name="format.icon" class="w-6 h-6" />
                <div class="text-center">
                  <p class="text-sm font-medium">
                    {{ format.label }}
                  </p>
                  <p class="text-xs opacity-70">
                    {{ format.description }}
                  </p>
                </div>
              </UButton>
            </div>
          </div>

          <!-- Export Filename -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Filename (optional)
            </label>
            <UInput
              v-model="exportFilename"
              class="w-full"
              placeholder="Leave empty for auto-generated name"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-4">
          <div class="flex items-center space-x-3">
            <div
              class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ isImport ? 'Processing import...' : 'Preparing export...' }}
            </span>
          </div>
        </div>

        <!-- Error Display -->
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :title="error"
        />

        <!-- Success Display -->
        <UAlert
          v-if="successMessage"
          color="success"
          variant="soft"
          icon="i-heroicons-check-circle"
          :title="successMessage"
        />

        <!-- Import Results -->
        <div v-if="importResults" class="space-y-3">
          <UCard>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Import Results
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center space-x-2">
                <UBadge color="success" variant="soft">
                  {{ importResults.imported }} imported
                </UBadge>
              </div>
              <div class="flex items-center space-x-2">
                <UBadge color="error" variant="soft">
                  {{ importResults.errors?.length ?? 0 }} errors
                </UBadge>
              </div>
            </div>
          </UCard>

          <!-- Import Errors Details -->
          <UCard v-if="importResults.errors && importResults.errors.length > 0">
            <h5 class="text-sm font-medium text-gray-900 dark:text-white">
              Import Errors
            </h5>
            <div class="max-h-32 overflow-y-auto space-y-1">
              <UAlert
                v-for="(importError, index) in importResults.errors"
                :key="index"
                color="error"
                variant="soft"
                size="sm"
                :title="`Row ${importError.row}: ${importError.message}`"
              />
            </div>
          </UCard>
        </div>
      </div>
      <div class="flex justify-end space-x-4 pt-6">
        <UButton variant="outline" :disabled="isLoading" @click="closeModal">
          {{ isImport ? 'Cancel' : 'Close' }}
        </UButton>
        <UButton
          v-if="isImport"
          :disabled="!selectedFile ?? isLoading"
          color="primary"
          @click="handleImport"
        >
          <Icon name="i-heroicons-arrow-up-tray" class="w-6 h-6 mr-2" />
          Import Participants
        </UButton>
        <UButton
          v-else
          :disabled="isLoading"
          color="primary"
          @click="handleExport"
        >
          <Icon name="i-heroicons-arrow-down-tray" class="w-6 h-6 mr-2" />
          Export Participants
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleError, handleSuccess } from '../../../utils/errorHandler'

interface Props {
  isImport: boolean
  tournamentId: string
  tournamentName: string
}

interface ImportError {
  row: number
  field: string
  message: string
  value: unknown
}

interface ImportResults {
  success: boolean
  imported: number
  errors?: ImportError[]
  warnings?: ImportError[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'import-success': [results: ImportResults]
  'export-success': []
  close: []
}>()

// State
const selectedFile = ref<File | null>(null)
const selectedFormat = ref('csv')
const exportFilename = ref('')
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const importResults = ref<ImportResults | null>(null)
const isDragOver = ref(false)
const fileError = ref('')
const fileInput = ref<HTMLInputElement>()

// Export formats
const exportFormats = [
  {
    value: 'csv',
    label: 'CSV',
    description: 'Spreadsheet',
    icon: 'i-heroicons-table-cells',
  },
  {
    value: 'xlsx',
    label: 'Excel',
    description: 'Excel file',
    icon: 'i-heroicons-document-text',
  },
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Document',
    icon: 'i-heroicons-document',
  },
]

// Reset state function
const resetState = () => {
  selectedFile.value = null
  selectedFormat.value = 'csv'
  exportFilename.value = ''
  isLoading.value = false
  error.value = ''
  successMessage.value = ''
  importResults.value = null
  isDragOver.value = false
  fileError.value = ''
}

const closeModal = () => {
  resetState()
  emit('close')
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleFileSelect = (event: Event) => {
  if (event.target && 'files' in event.target && event.target.files) {
    const files = event.target.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }
}

const handleFile = (file: File) => {
  // Validate file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  if (!allowedTypes.includes(file.type)) {
    fileError.value = 'Please select a CSV or Excel file'
    return
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    fileError.value = 'File size must be less than 10MB'
    return
  }

  selectedFile.value = file
  fileError.value = ''
}

const removeFile = () => {
  selectedFile.value = null
  fileError.value = ''
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadTemplate = async () => {
  try {
    const response = await $fetch('/api/export/template', {
      method: 'POST',
      body: {
        type: 'competitor',
        format: 'csv',
      },
    })

    if (response.success) {
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'participants_template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  } catch (err: unknown) {
    handleError(err, 'Error downloading template', 'Download Error')
    error.value = 'Failed to download template'
  }
}

const handleImport = async () => {
  if (!selectedFile.value) return

  isLoading.value = true
  error.value = ''
  successMessage.value = ''
  importResults.value = null

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('tournamentId', props.tournamentId)

    const response = await $fetch('/api/import/competitors', {
      method: 'POST',
      body: formData,
    })

    if (response.success) {
      successMessage.value = response.message
      importResults.value = {
        success: true,
        imported: response.imported,
        errors: Array.isArray(response.errors) ? response.errors : [],
        warnings: Array.isArray(response.warnings) ? response.warnings : [],
      }
      handleSuccess(
        `Successfully imported ${response.imported} participants`,
        'Import Success'
      )
      emit('import-success', importResults.value)
    } else {
      error.value = response.message || 'Import failed'
      importResults.value = {
        success: false,
        imported: response.imported ?? 0,
        errors: Array.isArray(response.errors) ? response.errors : [],
        warnings: Array.isArray(response.warnings) ? response.warnings : [],
      }
    }
  } catch (err: unknown) {
    handleError(err, 'Import error', 'Import Failed')
    error.value = err.data?.message || 'Import failed'
  } finally {
    isLoading.value = false
  }
}

const handleExport = async () => {
  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const filename =
      exportFilename.value ||
      `tournament_${props.tournamentId}_participants_${new Date().toISOString().split('T')[0]}`

    const response = await $fetch('/api/export/competitors', {
      method: 'POST',
      body: {
        tournamentId: props.tournamentId,
        format: selectedFormat.value,
        filename: exportFilename.value ?? undefined,
      },
      responseType: 'blob',
    })

    // Create blob and trigger download
    const blob = new Blob([response], {
      type:
        selectedFormat.value === 'csv'
          ? 'text/csv'
          : selectedFormat.value === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.${selectedFormat.value}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    successMessage.value = `Export completed successfully. File downloaded.`
    handleSuccess('Export completed successfully', 'Export Success')
    emit('export-success')
  } catch (err: unknown) {
    handleError(err, 'Export error', 'Export Failed')
    error.value = err.data?.message || 'Export failed'
  } finally {
    isLoading.value = false
  }
}
</script>
