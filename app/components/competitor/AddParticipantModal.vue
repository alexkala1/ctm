<template>
  <div class="p-6 max-h-[70vh] overflow-y-auto">
    <UForm
      :state="formData"
      :schema="validationSchema"
      class="space-y-8"
      @submit="handleSubmit"
    >
      <!-- Personal Information -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-user"
              class="w-4 h-4 text-blue-600 dark:text-blue-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UFormField
              name="firstName"
              label="First Name"
              required
            >
              <UInput
                v-model="formData.firstName"
                placeholder="Enter first name"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="lastName"
              label="Last Name"
              required
            >
              <UInput
                v-model="formData.lastName"
                placeholder="Enter last name"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="gender"
              label="Gender"
              required
            >
              <USelect
                v-model="formData.gender"
                :items="genderOptions"
                placeholder="Select gender"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </div>

      <!-- Tournament Information -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-trophy"
              class="w-4 h-4 text-green-600 dark:text-green-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Tournament Information
          </h3>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UFormField
              name="category"
              label="Category"
              required
            >
              <USelect
                v-model="formData.category"
                :items="categoryOptions"
                placeholder="Select category"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>

            <UFormField
              v-if="tournament?.hasTeams"
              name="team"
              label="Team (Optional)"
            >
              <UInput
                v-model="formData.team"
                placeholder="Enter team name"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-document-text"
              class="w-4 h-4 text-purple-600 dark:text-purple-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Additional Information
          </h3>
        </div>

        <div class="space-y-6">
          <UFormField
            name="ratedPlayerLinks"
            label="Rated Player Links (Optional)"
          >
            <UTextarea
              v-model="formData.ratedPlayerLinks"
              placeholder="Enter rated player links (one per line)"
              :rows="4"
              :disabled="isSubmitting"
              size="md"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="tournamentDocument"
            label="Document (Optional)"
          >
            <div class="space-y-3">
              <!-- Document Type Selection -->
              <URadioGroup
                v-model="documentType"
                :items="documentTypeOptions"
                :disabled="isSubmitting"
                orientation="horizontal"
                size="sm"
              />

              <!-- URL Input -->
              <UInput
                v-if="documentType === 'url'"
                v-model="formData.tournamentDocumentUrl"
                placeholder="Enter document URL (PDF, images)"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />

              <!-- File Upload -->
              <div
                v-if="documentType === 'file'"
                class="space-y-3"
              >
                <!-- Drag & Drop Area -->
                <div
                  class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 cursor-pointer transition-colors duration-200"
                  :class="{
                    'border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/10':
                      isDragOver,
                    'border-red-300 dark:border-red-600': uploadError,
                  }"
                  @dragover.prevent="isDragOver = true"
                  @dragleave.prevent="isDragOver = false"
                  @drop.prevent="handleFileDrop"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    :disabled="isSubmitting"
                    class="hidden"
                    @change="handleFileUpload"
                  >

                  <!-- Upload Icon -->
                  <div class="flex justify-center">
                    <div
                      class="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center"
                    >
                      <Icon
                        name="i-heroicons-cloud-arrow-up"
                        class="w-6 h-6 text-primary-600 dark:text-primary-400"
                      />
                    </div>
                  </div>

                  <!-- Upload Text -->
                  <div class="space-y-1 mb-4">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      <span class="text-primary-600 dark:text-primary-400">Click to upload</span>
                      or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      PDF, JPG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </div>

                  <!-- Selected File Display -->
                  <div
                    v-if="uploadedFile"
                    class="mt-4 mb-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Icon
                        name="i-heroicons-document-check"
                        class="w-5 h-5 text-green-600 dark:text-green-400"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                          {{ uploadedFile.name }}
                        </p>
                        <p class="text-xs text-green-600 dark:text-green-400">
                          {{ formatFileSize(uploadedFile.size) }}
                        </p>
                      </div>
                      <UButton
                        type="button"
                        size="sm"
                        variant="ghost"
                        color="error"
                        icon="i-heroicons-x-mark"
                        @click.stop="removeFile"
                      />
                    </div>
                  </div>

                  <!-- Error Display -->
                  <div
                    v-if="uploadError"
                    class="mt-4 mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Icon
                        name="i-heroicons-exclamation-triangle"
                        class="w-5 h-5 text-red-600 dark:text-red-400"
                      />
                      <p class="text-sm text-red-800 dark:text-red-200">
                        {{ uploadError }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UFormField>
        </div>
      </div>

      <!-- Admin Section (only for admins) -->
      <div
        v-if="isAdmin"
        class="space-y-6"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-shield-check"
              class="w-4 h-4 text-orange-600 dark:text-orange-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Admin Settings</h3>
        </div>

        <div class="space-y-6">
          <UFormField
            name="playerAcceptanceStatus"
            label="Status"
          >
            <USelect
              v-model="formData.playerAcceptanceStatus"
              :items="statusOptions"
              placeholder="Select status"
              :disabled="isSubmitting"
              size="md"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="adminNotes"
            label="Admin Notes (Optional)"
          >
            <UTextarea
              v-model="formData.adminNotes"
              placeholder="Enter admin notes"
              :rows="4"
              :disabled="isSubmitting"
              size="md"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { handleError } from '../../../utils/errorHandler'

// import type { CreateCompetitorFormData } from '../../../types/forms'
import type {
  TournamentApiResponse,
  CompetitorApiResponse,
  Gender,
  PlayerAcceptanceStatus,
} from '~/types/tournament'

interface Props {
  tournament: TournamentApiResponse | null
  isAdmin: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'participant-added': [participant: CompetitorApiResponse]
  close: []
}>()

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  gender: 'MALE' as Gender,
  category: '',
  team: '',
  ratedPlayerLinks: '',
  tournamentDocumentUrl: '',
  playerAcceptanceStatus: 'PENDING' as PlayerAcceptanceStatus,
  adminNotes: '',
  tournamentId: props.tournament?.id || '',
})

// Validation schema
const validationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  gender: z.enum(['MALE', 'FEMALE']),
  category: z.string().min(1, 'Category is required'),
  team: z
    .string()
    .max(100, 'Team name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  ratedPlayerLinks: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const links = val.split('\n').filter(link => link.trim())
      return links.every(link => {
        try {
          new URL(link.trim())
          return true
        } catch {
          return false
        }
      })
    }, 'Please enter valid URLs, one per line'),
  tournamentDocumentUrl: z
    .string()
    .optional()
    .refine(val => {
      if (!val || val === '') return true
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid URL or leave empty'),
  playerAcceptanceStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  adminNotes: z.string().max(500, 'Admin notes must be less than 500 characters').optional(),
})

// Options
const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
]

const statusOptions: Array<{ label: string; value: PlayerAcceptanceStatus }> = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

const documentTypeOptions: Array<{ label: string; value: string }> = [
  { label: 'URL', value: 'url' },
  { label: 'File Upload', value: 'file' },
]

const categoryOptions = computed(() => {
  if (!props.tournament?.categories) return []
  return props.tournament.categories.map((category: string) => ({
    label: category,
    value: category,
  }))
})

// State
const isSubmitting = ref(false)
const documentType = ref('url')
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const isDragOver = ref(false)
const uploadError = ref('')

// Methods
const validateFile = (file: File): string | null => {
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return 'File size must be less than 10MB'
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ]
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a PDF or image file'
  }

  return null
}

const processFile = (file: File) => {
  const error = validateFile(file)
  if (error) {
    uploadError.value = error
    return
  }

  uploadError.value = ''
  uploadedFile.value = file
  // Clear URL when file is selected
  formData.value.tournamentDocumentUrl = ''
}

const handleFileUpload = (event: Event) => {
  if (event.target && 'files' in event.target) {
    const target = event.target as { files: FileList | null }
    if (target.files && target.files[0]) {
      processFile(target.files[0])
    }
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const removeFile = () => {
  uploadedFile.value = null
  uploadError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async (_event: Event) => {
  console.log('Form submitted!', formData.value)
  try {
    isSubmitting.value = true

    // Process rated player links
    const links = formData.value.ratedPlayerLinks
      ? formData.value.ratedPlayerLinks.split('\n').filter((link: string) => link.trim())
      : []

    // Handle document upload
    let documentUrl: string | undefined = formData.value.tournamentDocumentUrl
    if (documentType.value === 'file' && uploadedFile.value) {
      // For now, we'll set it to undefined since we don't have a real file upload service
      // In a real app, you'd upload the file to a storage service and get a real URL
      documentUrl = undefined
    }

    const participantData = {
      ...formData.value,
      ratedPlayerLinks: links,
      tournamentDocumentUrl: documentUrl || undefined,
      team: formData.value.team?.trim() || undefined,
      adminNotes: formData.value.adminNotes?.trim() || undefined,
      tournamentId: props.tournament?.id,
    }

    // Call API to add participant
    const response = await $fetch('/api/competitors', {
      method: 'POST',
      body: participantData,
    })

    if (response.success) {
      console.log('API success, emitting events with data:', response.data)
      emit('participant-added', response.data)
      emit('close')
    } else {
      console.error('API returned success: false', response)
    }
  } catch (error) {
    handleError(error, 'Error adding participant', 'Add Participant Failed')
  } finally {
    isSubmitting.value = false
  }
}

// Method for programmatic submission from parent component
const submitForm = async () => {
  // Trigger the form submission manually
  const form = document.querySelector('form') as HTMLFormElement
  if (form) {
    form.dispatchEvent(new Event('submit', { cancelable: true }))
  }
}

// Expose methods and state for parent component
defineExpose({
  submitForm,
  isSubmitting: readonly(isSubmitting),
})
</script>
