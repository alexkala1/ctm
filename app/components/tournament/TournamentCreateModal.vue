<template>
    
  <div class="p-6 max-h-[70vh] overflow-y-auto">
    <UForm
      :state="formData"
      :schema="validationSchema"
      class="space-y-8"
      @submit="handleSubmit"
    >
      <!-- Basic Information -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Icon
              name="i-heroicons-information-circle"
              class="w-4 h-4 text-blue-600 dark:text-blue-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>

        <div class="space-y-6">
          <UFormField
            label="Tournament Name"
            name="name"
            required
          >
            <UInput
              v-model="formData.name"
              placeholder="Enter tournament name"
              :disabled="isSubmitting"
              size="md"
              icon="i-heroicons-trophy"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Status"
            name="status"
            required
          >
            <USelect
              v-model="formData.status"
              :items="statusOptions"
              option-attribute="label"
              value-attribute="value"
              placeholder="Select status"
              :disabled="isSubmitting"
              size="md"
              icon="i-heroicons-flag"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <!-- Tournament Schedule -->
      <div class="space-y-6">
        <UFormField
          label="Tournament Dates"
          name="tournamentStart"
          required
        >
          <UPopover
            :open="tournamentPopoverOpen"
            @update:open="tournamentPopoverOpen = $event"
          >
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-heroicons-calendar-days"
              :disabled="isSubmitting"
              size="md"
              class="w-full justify-start"
            >
              <template v-if="tournamentDateRange.start">
                <template v-if="tournamentDateRange.end">
                  {{
                    df.format(
                      (tournamentDateRange.start as CalendarDate).toDate(
                        getLocalTimeZone()
                      )
                    )
                  }}
                  -
                  {{
                    df.format(
                      (tournamentDateRange.end as CalendarDate).toDate(
                        getLocalTimeZone()
                      )
                    )
                  }}
                </template>
                <template v-else>
                  {{
                    df.format(
                      (tournamentDateRange.start as CalendarDate).toDate(
                        getLocalTimeZone()
                      )
                    )
                  }}
                </template>
              </template>
              <template v-else> Select tournament dates </template>
            </UButton>

            <template #content>
              <UCalendar
                v-model="tournamentDateRange"
                class="p-2"
                :number-of-months="2"
                :min-value="today"
                range
              />
            </template>
          </UPopover>
        </UFormField>
      </div>

      <!-- Registration Period -->
      <div class="space-y-6">
        <UFormField
          label="Registration Period"
          name="tournamentRegistrationStart"
          required
        >
          <UPopover
            :open="registrationPopoverOpen"
            @update:open="registrationPopoverOpen = $event"
          >
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-heroicons-calendar-days"
              :disabled="isSubmitting"
              size="md"
              class="w-full justify-start"
            >
              <template v-if="registrationDateRange.start">
                <template v-if="registrationDateRange.end">
                  {{
                    df.format(
                      (registrationDateRange.start as CalendarDate).toDate(
                        getLocalTimeZone()
                      )
                    )
                  }}
                  -
                  {{
                    df.format(
                      (registrationDateRange.end as CalendarDate).toDate(
                        getLocalTimeZone()
                      )
                    )
                  }}
                </template>
                <template v-else>
                  {{
                    df.format(
                      (registrationDateRange.start as CalendarDate).toDate(
                        getLocalTimeZone()
                      )
                    )
                  }}
                </template>
              </template>
              <template v-else> Select registration period </template>
            </UButton>

            <template #content>
              <UCalendar
                v-model="registrationDateRange"
                class="p-2"
                :number-of-months="2"
                :min-value="today"
                range
              />
            </template>
          </UPopover>
        </UFormField>
      </div>

      <!-- Tournament Categories -->
      <div class="space-y-6">
        <div
          v-for="(_category, index) in formData.categories"
          :key="index"
          class="flex items-center gap-3"
        >
          <UInput
            v-model="formData.categories[index]"
            :placeholder="`Category ${index + 1}`"
            :disabled="isSubmitting"
            size="md"
            icon="i-heroicons-tag"
            class="flex-1"
            @keydown.enter="handleCategoryEnter(index, $event)"
          />
          <UButton
            v-if="formData.categories.length > 1"
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            size="sm"
            :disabled="isSubmitting"
            @click="removeCategory(index)"
          />
        </div>
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-plus"
          size="sm"
          :disabled="isSubmitting"
          @click="addCategory"
        >
          Add Category
        </UButton>
      </div>

      <!-- Team Settings -->
      <div class="space-y-6">
        <UFormField name="hasTeams">
          <div class="relative">
            <div
              class="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 transition-all duration-200 hover:from-purple-50/70 hover:to-pink-50/70 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30"
            >
              <div class="flex-shrink-0">
                <UCheckbox
                  v-model="formData.hasTeams"
                  :disabled="isSubmitting"
                  size="md"
                  class="mt-1"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <Icon
                    name="i-heroicons-users"
                    class="w-6 h-6 text-purple-600 dark:text-purple-400"
                  />
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Enable team participation
                  </p>
                </div>
                <p
                  class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  Allow teams to participate in this tournament (optional)
                </p>
              </div>
            </div>
            <!-- Subtle accent line -->
            <div
              class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-500 rounded-l-xl opacity-60"
            />
          </div>
        </UFormField>
      </div>

      <!-- Team Management (when teams are enabled) -->
      <div
        v-if="formData.hasTeams"
        class="space-y-6"
      >
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div class="flex items-start space-x-3">
            <Icon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
            />
            <div>
              <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">
                How Teams Work
              </h4>
              <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                When teams are enabled, competitors can join existing teams or
                create new ones during registration. Teams will be automatically
                created as competitors register with team names.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- External Links -->
      <div class="space-y-6">
        <UFormField
          label="Proclamations URL"
          name="proclamations"
        >
          <UInput
            v-model="formData.proclamations"
            placeholder="https://example.com/proclamations"
            :disabled="isSubmitting"
            size="md"
            icon="i-heroicons-document-text"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Chess Results URL"
          name="chessResults"
        >
          <UInput
            v-model="formData.chessResults"
            placeholder="https://example.com/results"
            :disabled="isSubmitting"
            size="md"
            icon="i-heroicons-chart-bar"
            class="w-full"
          />
        </UFormField>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

import type { CreateTournamentInput, TournamentApiResponse } from '../../../types'

// Define DateRange type manually since it's not exported
type DateRange = {
  start: CalendarDate | undefined
  end: CalendarDate | undefined
}

// Emits
const emit = defineEmits<{
  'tournament-created': [tournament: TournamentApiResponse]
  close: []
}>()

// Form state
const isSubmitting = ref(false)

// Date formatter for display
const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

// Today's date for min date constraints
const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
)

// Date picker reactive variables
const tournamentDateRange = shallowRef<DateRange>({
  start: undefined,
  end: undefined,
})
const registrationDateRange = shallowRef<DateRange>({
  start: undefined,
  end: undefined,
})

// Popover open state for controlling visibility
const tournamentPopoverOpen = ref(false)
const registrationPopoverOpen = ref(false)

// Validation schema
const validationSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    status: z.enum(['DRAFT', 'OPEN']),
    tournamentStart: z.string().min(1, 'Start date is required'),
    tournamentEnd: z.string().min(1, 'End date is required'),
    tournamentRegistrationStart: z
      .string()
      .min(1, 'Registration start date is required'),
    tournamentRegistrationEnd: z
      .string()
      .min(1, 'Registration end date is required'),
    categories: z
      .array(z.string().min(1, 'Category cannot be empty'))
      .min(1, 'At least one category is required'),
    hasTeams: z.boolean(),
    proclamations: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    chessResults: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const tournamentStart = new Date(data.tournamentStart)
      const tournamentEnd = new Date(data.tournamentEnd)
      const registrationStart = new Date(data.tournamentRegistrationStart)
      const registrationEnd = new Date(data.tournamentRegistrationEnd)

      // Tournament end must be after start
      if (tournamentEnd <= tournamentStart) {
        return false
      }

      // Registration end must be after start
      if (registrationEnd <= registrationStart) {
        return false
      }

      // Registration must end before tournament starts
      if (registrationEnd >= tournamentStart) {
        return false
      }

      return true
    },
    {
      message:
        'Registration must end before tournament starts, and all date ranges must be valid',
      path: ['tournamentStart'],
    }
  )

// Form data
const formData = ref({
  name: '',
  status: 'DRAFT' as const,
  tournamentStart: '',
  tournamentEnd: '',
  tournamentRegistrationStart: '',
  tournamentRegistrationEnd: '',
  categories: ['Open'],
  hasTeams: false,
  proclamations: '',
  chessResults: '',
})

// Status options - only DRAFT and OPEN allowed for new tournaments
const statusOptions = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Open', value: 'OPEN' },
]

// Form validation is now handled by UForm with Zod schema

// Watch for date range changes and update form data
watch(
  tournamentDateRange,
  (range) => {
    if (range && range.start && range.end) {
      // Set start date to beginning of day
      const startDate = new Date(
        (range.start as CalendarDate).year,
        (range.start as CalendarDate).month - 1,
        (range.start as CalendarDate).day,
        9,
        0
      )
      formData.value.tournamentStart = startDate.toISOString()

      // Set end date to end of day
      const endDate = new Date(
        (range.end as CalendarDate).year,
        (range.end as CalendarDate).month - 1,
        (range.end as CalendarDate).day,
        18,
        0
      )
      formData.value.tournamentEnd = endDate.toISOString()

      // Close popover when selection is complete
      tournamentPopoverOpen.value = false
    }
  },
  { deep: true }
)

watch(
  registrationDateRange,
  (range) => {
    if (range && range.start && range.end) {
      // Set start date to beginning of day
      const startDate = new Date(
        (range.start as CalendarDate).year,
        (range.start as CalendarDate).month - 1,
        (range.start as CalendarDate).day,
        0,
        0
      )
      formData.value.tournamentRegistrationStart = startDate.toISOString()

      // Set end date to end of day
      const endDate = new Date(
        (range.end as CalendarDate).year,
        (range.end as CalendarDate).month - 1,
        (range.end as CalendarDate).day,
        23,
        59
      )
      formData.value.tournamentRegistrationEnd = endDate.toISOString()

      // Close popover when selection is complete
      registrationPopoverOpen.value = false
    }
  },
  { deep: true }
)

// Format datetime for display
const _formatDateTime = (isoString: string) => {
  const date = new Date(isoString)
  const dateStr = df.format(date)
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${dateStr} at ${timeStr}`
}

// Format date range for display
const _formatDateRange = (
  range: { start: CalendarDate | null; end: CalendarDate | null } | null
) => {
  if (!range || !range.start || !range.end) return ''

  const startStr = df.format(range.start.toDate(getLocalTimeZone()))
  const endStr = df.format(range.end.toDate(getLocalTimeZone()))

  if (range.start.compare(range.end) === 0) {
    return startStr
  }

  return `${startStr} - ${endStr}`
}

// Category management
const addCategory = () => {
  formData.value.categories.push('')
}

const removeCategory = (index: number) => {
  if (formData.value.categories.length > 1) {
    formData.value.categories.splice(index, 1)
  }
}

const handleCategoryEnter = (index: number, event: KeyboardEvent) => {
  event.preventDefault()
  // Add new empty category if current one has content
  if (formData.value.categories[index]?.trim()) {
    addCategory()
    // Focus the next input after a short delay
    nextTick(() => {
      const nextInput = document.querySelector(
        `input[placeholder="Category ${formData.value.categories.length}"]`
      ) as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    })
  }
}

// Form submission
const handleSubmit = async (
  event: FormSubmitEvent<z.infer<typeof validationSchema>>
) => {
  isSubmitting.value = true
  try {
    // Convert datetime-local values to ISO strings
    const data: CreateTournamentInput = {
      ...event.data,
      tournamentStart: new Date(event.data.tournamentStart).toISOString(),
      tournamentEnd: new Date(event.data.tournamentEnd).toISOString(),
      tournamentRegistrationStart: new Date(
        event.data.tournamentRegistrationStart
      ).toISOString(),
      tournamentRegistrationEnd: new Date(
        event.data.tournamentRegistrationEnd
      ).toISOString(),
    }

    const response = await $fetch('/api/tournaments', {
      method: 'POST',
      body: data,
    })

    if (response.success) {
      emit('tournament-created', response.data)
      resetForm()
      // TODO: Add success toast notification
    } else {
      throw new Error('Failed to create tournament')
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development')
      console.error('Error creating tournament:', error)
    // TODO: Add error toast notification
  } finally {
    isSubmitting.value = false
  }
}

// Reset form function
const resetForm = () => {
  formData.value = {
    name: '',
    status: 'DRAFT' as const,
    tournamentStart: '',
    tournamentEnd: '',
    tournamentRegistrationStart: '',
    tournamentRegistrationEnd: '',
    categories: ['Open'],
    hasTeams: false,
    proclamations: '',
    chessResults: '',
  }

  // Reset date picker variables
  tournamentDateRange.value = { start: undefined, end: undefined }
  registrationDateRange.value = { start: undefined, end: undefined }
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
  resetForm,
  submitForm,
  isSubmitting: readonly(isSubmitting) 
})
</script>
