<template>
  <div class="p-6 max-h-[70vh] overflow-y-auto">
    <UForm :state="formData" :schema="validationSchema" class="space-y-8" @submit="handleSubmit">
      <!-- Personal Information -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Icon name="i-heroicons-user" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UFormField name="firstName" label="First Name" required>
              <UInput
                v-model="formData.firstName"
                placeholder="Enter first name"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>

            <UFormField name="lastName" label="Last Name" required>
              <UInput
                v-model="formData.lastName"
                placeholder="Enter last name"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>

            <UFormField name="gender" label="Gender" required>
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
          <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Icon name="i-heroicons-trophy" class="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tournament Information</h3>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UFormField name="category" label="Category" required>
              <USelect
                v-model="formData.category"
                :items="categoryOptions"
                placeholder="Select category"
                :disabled="isSubmitting"
                size="md"
                class="w-full"
              />
            </UFormField>

            <UFormField v-if="tournament?.hasTeams" name="team" label="Team (Optional)">
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
          <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Icon name="i-heroicons-document-text" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
        </div>

        <div class="space-y-6">
          <UFormField name="ratedPlayerLinks" label="Rated Player Links (Optional)">
            <UTextarea
              v-model="formData.ratedPlayerLinks"
              placeholder="Enter rated player links (one per line)"
              :rows="4"
              :disabled="isSubmitting"
              size="md"
              class="w-full"
            />
          </UFormField>

          <UFormField name="tournamentDocument" label="Document (Optional)">
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
              <div v-if="documentType === 'file'" class="space-y-3">
                <!-- Drag & Drop Area -->
                <div
                  class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 cursor-pointer transition-colors duration-200"
                  :class="{
                    'border-primary-400 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/10': isDragOver,
                    'border-red-300 dark:border-red-600': uploadError,
                  }"
                  @dragover.prevent="isDragOver = true"
                  @dragleave.prevent="isDragOver = false"
                  @drop.prevent="handleFileDrop"
                  @click="fileInput?.click()"
                >
                  <UInput
                    ref="fileInput"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    :disabled="isSubmitting"
                    class="hidden"
                    @change="handleFileUpload"
                  />

                  <!-- Upload Icon -->
                  <div class="flex justify-center mb-3">
                    <div
                      class="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center"
                    >
                      <Icon name="i-heroicons-cloud-arrow-up" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>

                  <!-- Upload Text -->
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      <span class="text-primary-600 dark:text-primary-400">Click to upload</span>
                      or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG, GIF, WebP (Max 10MB)</p>
                  </div>

                  <!-- Selected File Display -->
                  <div
                    v-if="uploadedFile"
                    class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Icon name="i-heroicons-document-check" class="w-5 h-5 text-green-600 dark:text-green-400" />
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
                    class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
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

      <!-- Admin Section -->
      <div class="space-y-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Icon name="i-heroicons-shield-check" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Admin Settings</h3>
        </div>

        <div class="space-y-6">
          <UFormField name="playerAcceptanceStatus" label="Status">
            <USelect
              v-model="formData.playerAcceptanceStatus"
              :items="statusOptions"
              placeholder="Select status"
              :disabled="isSubmitting"
              size="md"
              class="w-full"
            />
          </UFormField>

          <UFormField name="adminNotes" label="Admin Notes (Optional)">
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

  <!-- Footer with action buttons -->
  <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
    <UButton
      color="neutral"
      variant="soft"
      :disabled="isSubmitting"
      size="md"
      class="w-full sm:w-auto"
      icon="i-heroicons-x-mark"
      @click="handleCancel"
    >
      Cancel
    </UButton>
    <UButton
      color="primary"
      variant="soft"
      type="submit"
      :loading="isSubmitting"
      :disabled="isSubmitting"
      size="md"
      class="w-full sm:w-auto"
      icon="i-heroicons-check"
      @click="handleSubmit"
    >
      Update Participant
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

import type { UpdateCompetitorFormData } from '~/types/forms';
import type {
  TournamentApiResponse,
  CompetitorApiResponse,
  Gender,
  PlayerAcceptanceStatus,
} from '../../../types/tournament';

const { tournament, participant } = defineProps<{
  tournament: TournamentApiResponse | null;
  participant: CompetitorApiResponse | null;
}>();

const emit = defineEmits<{
  participantUpdated: [participant: CompetitorApiResponse];
  close: [];
}>();

// Form data - reactive to participant changes
const formData = ref<UpdateCompetitorFormData>({
  id: '',
  firstName: '',
  lastName: '',
  gender: 'MALE' as Gender,
  category: '',
  team: null,
  ratedPlayerLinks: '',
  tournamentDocumentUrl: null,
  playerAcceptanceStatus: 'PENDING' as PlayerAcceptanceStatus,
  adminNotes: null,
});

// Validation schema
const validationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  category: z.string().min(1, 'Category is required'),
  team: z.string().nullable().optional(),
  ratedPlayerLinks: z.string().optional(),
  tournamentDocument: z.string().optional(),
  playerAcceptanceStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  adminNotes: z.string().nullable().optional(),
});

// Options
const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
];

const statusOptions: Array<{ label: string; value: PlayerAcceptanceStatus }> = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const documentTypeOptions: Array<{ label: string; value: string }> = [
  { label: 'URL', value: 'url' },
  { label: 'File Upload', value: 'file' },
];

const categoryOptions = computed(() => {
  if (!tournament?.categories) return [];
  return tournament.categories.map(category => ({
    label: category,
    value: category,
  }));
});

// State
const isSubmitting = ref(false);
const documentType = ref('url');
const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFile = ref<File | null>(null);
const isDragOver = ref(false);
const uploadError = ref('');

// Watch for participant changes to populate form data
watch(
  () => participant,
  newParticipant => {
    if (newParticipant) {
      formData.value = {
        id: newParticipant.id,
        firstName: newParticipant.firstName || '',
        lastName: newParticipant.lastName || '',
        gender: newParticipant.gender || '',
        category: newParticipant.category || '',
        team: newParticipant.team ?? null,
        ratedPlayerLinks: Array.isArray(newParticipant.ratedPlayerLinks)
          ? newParticipant.ratedPlayerLinks.join('\n')
          : newParticipant.ratedPlayerLinks || '',
        tournamentDocumentUrl: newParticipant.tournamentDocumentUrl ?? null,
        playerAcceptanceStatus: newParticipant.playerAcceptanceStatus || 'PENDING',
        adminNotes: newParticipant.adminNotes ?? null,
      };
    }
  },
  { immediate: true }
);

// Methods
const validateFile = (file: File): string | null => {
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return 'File size must be less than 10MB';
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a PDF or image file';
  }

  return null;
};

const processFile = (file: File) => {
  const error = validateFile(file);
  if (error) {
    uploadError.value = error;
    return;
  }

  uploadError.value = '';
  uploadedFile.value = file;
  // Clear URL when file is selected
  formData.value.tournamentDocumentUrl = '';
};

const handleFileUpload = (event: Event) => {
  if (event.target && 'files' in event.target) {
    const target = event.target as { files: FileList | null };
    if (target.files && target.files[0]) {
      processFile(target.files[0]);
    }
  }
};

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
};

const removeFile = () => {
  uploadedFile.value = null;
  uploadError.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleSubmit = async (_event: Event) => {
  try {
    isSubmitting.value = true;

    // Process rated player links
    const links = formData.value.ratedPlayerLinks
      ? formData.value.ratedPlayerLinks.split('\n').filter((link: string) => link.trim())
      : [];

    // Handle document upload
    let documentUrl = formData.value.tournamentDocumentUrl;
    if (documentType.value === 'file' && uploadedFile.value) {
      // For now, we'll just use a placeholder URL
      // In a real app, you'd upload the file to a storage service
      documentUrl = `uploaded-file-${uploadedFile.value.name}`;
    }

    const participantData = {
      ...formData.value,
      ratedPlayerLinks: links,
      tournamentDocumentUrl: documentUrl ?? null,
      team: formData.value.team?.trim() || null,
      adminNotes: formData.value.adminNotes?.trim() || null,
    };

    // Call API to update participant
    const response = await $fetch(`/api/competitors/${participant?.id}`, {
      method: 'PUT',
      body: participantData,
    });

    if (response.success) {
      emit('participantUpdated', response.data);
      emit('close');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error updating participant:', error);
    // Handle error (you might want to show a toast notification)
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('close');
};
</script>
