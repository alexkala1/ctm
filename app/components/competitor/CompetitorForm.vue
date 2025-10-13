<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">
          {{ isEdit ? 'Edit Competitor' : 'Register for Tournament' }}
        </h3>

        <VeeForm
          :validation-schema="schema"
          :initial-values="initialValues"
          class="space-y-6"
          @submit="handleSubmit"
        >
          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VeeField
              v-slot="{ field, errorMessage }"
              name="firstName"
            >
              <UFormGroup
                label="First Name"
                :error="errorMessage"
                required
              >
                <UInput
                  v-bind="field"
                  placeholder="Enter first name"
                  :disabled="isSubmitting"
                />
              </UFormGroup>
            </VeeField>

            <VeeField
              v-slot="{ field, errorMessage }"
              name="lastName"
            >
              <UFormGroup
                label="Last Name"
                :error="errorMessage"
                required
              >
                <UInput
                  v-bind="field"
                  placeholder="Enter last name"
                  :disabled="isSubmitting"
                />
              </UFormGroup>
            </VeeField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VeeField
              v-slot="{ field, errorMessage }"
              name="gender"
            >
              <UFormGroup
                label="Gender"
                :error="errorMessage"
                required
              >
                <USelect
                  v-bind="field"
                  :items="genderOptions"
                  placeholder="Select gender"
                  :disabled="isSubmitting"
                />
              </UFormGroup>
            </VeeField>

            <VeeField
              v-slot="{ field, errorMessage }"
              name="category"
            >
              <UFormGroup
                label="Category"
                :error="errorMessage"
                required
              >
                <USelect
                  v-bind="field"
                  :items="categoryOptions"
                  placeholder="Select category"
                  :disabled="isSubmitting"
                />
              </UFormGroup>
            </VeeField>
          </div>

          <!-- Team/School Information -->
          <div
            v-if="tournament?.hasTeams"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <VeeField
              v-slot="{ field, errorMessage }"
              name="team"
            >
              <UFormGroup
                label="Team"
                :error="errorMessage"
              >
                <USelect
                  v-bind="field"
                  :items="teamOptions"
                  placeholder="Select or enter team name"
                  :disabled="isSubmitting"
                  searchable
                  creatable
                />
              </UFormGroup>
            </VeeField>
          </div>

          <!-- Document Upload -->
          <VeeField
            v-slot="{ errorMessage }"
            name="tournamentDocument"
          >
            <UFormGroup
              label="Tournament Document"
              :error="errorMessage"
            >
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <div class="space-y-1 text-center">
                  <Icon
                    name="i-heroicons-document"
                    class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  />
                  <div class="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        class="sr-only"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        :disabled="isSubmitting"
                        @change="handleFileChange"
                      >
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX, JPG, PNG up to 5MB
                  </p>
                </div>
              </div>
              <div
                v-if="selectedFile"
                class="mt-2 text-sm text-gray-600 dark:text-gray-400"
              >
                Selected: {{ selectedFile.name }}
              </div>
            </UFormGroup>
          </VeeField>

          <!-- Admin Notes (Admin only) -->
          <VeeField
            v-if="isAdmin"
            v-slot="{ field, errorMessage }"
            name="adminNotes"
          >
            <UFormGroup
              label="Admin Notes"
              :error="errorMessage"
            >
              <UTextarea
                v-bind="field"
                placeholder="Add any admin notes..."
                :disabled="isSubmitting"
                rows="3"
              />
            </UFormGroup>
          </VeeField>

          <!-- Status (Admin only) -->
          <VeeField
            v-if="isAdmin"
            v-slot="{ field, errorMessage }"
            name="playerAcceptanceStatus"
          >
            <UFormGroup
              label="Status"
              :error="errorMessage"
            >
              <USelect
                v-bind="field"
                :items="statusOptions"
                placeholder="Select status"
                :disabled="isSubmitting"
              />
            </UFormGroup>
          </VeeField>

          <!-- Actions -->
          <div
            class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <UButton
              type="button"
              variant="soft"
              :disabled="isSubmitting"
              @click="$emit('cancel')"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isEdit ? 'Update Competitor' : 'Register' }}
            </UButton>
          </div>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, mixed } from 'yup'

import type { Tournament, Competitor } from '../../../types/tournament'

interface Props {
  tournament: Tournament
  competitor: Competitor
  isAdmin?: boolean
  isSubmitting?: boolean
}

const { tournament, competitor, isAdmin = false, isSubmitting = false } = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
  cancel: []
}>()

const isEdit = computed(() => !!competitor)
const selectedFile = ref<File | null>(null)

const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
]

const categoryOptions = computed(() => {
  if (!tournament?.categories) return []
  return tournament.categories.map(cat => ({ label: cat, value: cat }))
})

const teamOptions = computed(() => {
  // Get existing teams from tournament competitors if available
  const existingTeams =
    tournament?.competitors?.map(c => c.team).filter(team => team && team.trim() !== '') || []

  const uniqueTeams = [...new Set(existingTeams)]

  return [
    { label: 'No Team', value: '' },
    ...uniqueTeams.map(team => ({ label: team, value: team })),
  ]
})

const statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

const initialValues = computed(() => ({
  firstName: competitor?.firstName || '',
  lastName: competitor?.lastName || '',
  gender: competitor?.gender || '',
  category: competitor?.category || '',
  team: competitor?.team || '',
  tournamentDocument: null,
  adminNotes: competitor?.adminNotes || '',
  playerAcceptanceStatus: competitor?.playerAcceptanceStatus || 'PENDING',
}))

const schema = object({
  firstName: string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  gender: string().oneOf(['MALE', 'FEMALE'], 'Invalid gender').required('Gender is required'),
  category: string().required('Category is required'),
  team: string().nullable(),
  tournamentDocument: mixed().nullable(),
  adminNotes: string().nullable(),
  playerAcceptanceStatus: string()
    .oneOf(['PENDING', 'APPROVED', 'REJECTED'], 'Invalid status')
    .nullable(),
})

const handleSubmit = (values: Record<string, unknown>) => {
  const data = {
    ...values,
    tournamentDocument: selectedFile.value,
  }

  emit('submit', data)
}

const handleFileChange = (event: Event) => {
  if (event.target && 'files' in event.target) {
    const target = event.target as { files: FileList | null }
    if (target.files && target.files[0]) {
      selectedFile.value = target.files[0]
    }
  }
}
</script>
