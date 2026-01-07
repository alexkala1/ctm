<template>
  <!-- Content -->
  <div class="space-y-8">
    <!-- Import Section -->
    <div v-if="isImport" class="space-y-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Icon name="i-heroicons-information-circle" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Import Instructions</h3>
      </div>

      <div class="space-y-6">
        <UiModernAlert type="info" title="File Requirements" show-icon class="transition-none">
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Use CSV or Excel (.xlsx) files</li>
            <li>Required columns: First Name, Last Name, Gender, Category</li>
            <li>Optional columns: Team, Admin Notes</li>
            <li>Gender must be MALE or FEMALE</li>
            <li>Category must match tournament categories</li>
          </ul>
        </UiModernAlert>

        <!-- File Upload Section -->
        <div class="space-y-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Icon name="i-heroicons-cloud-arrow-up" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">File Upload</h3>
          </div>

          <div class="space-y-3">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Select File </label>
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                :class="{
                  'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragOver,
                  'border-red-400 bg-red-50 dark:bg-red-900/20': fileError,
                }"
                role="button"
                tabindex="0"
                @click="() => fileInput?.click()"
                @keydown.enter.prevent="() => fileInput?.click()"
                @keydown.space.prevent="() => fileInput?.click()"
                @drop="handleFileDrop"
                @dragover.prevent
                @dragenter.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
              >
                <input ref="fileInput" type="file" accept=".csv,.xlsx,.xls" class="hidden" @change="handleFileSelect" />
                <div v-if="!selectedFile" class="py-4">
                  <Icon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop your file here, or
                    <span class="text-blue-600 dark:text-blue-400 underline">browse files</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">CSV, XLSX files up to 10MB</p>
                </div>
                <div v-else>
                  <Icon name="i-heroicons-document" class="w-8 h-8 text-blue-500" />
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    {{ formatFileSize(selectedFile.size) }}
                  </p>
                  <UButton variant="solid" size="sm" color="error" class="duration-0 no-transition" @click="removeFile">
                    Remove
                  </UButton>
                </div>
              </div>
              <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" />
            </div>
          </div>

          <!-- Download Template -->
          <UiModernCard variant="solid" class="no-transition" size="md" :hover="false">
            <div class="flex items-center justify-between w-full">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Need a template?</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Download our sample file to see the correct format
                </p>
              </div>
              <UButton
                color="info"
                variant="ghost"
                size="sm"
                class="rounded-full px-4 py-2 shadow-none hover:shadow-none duration-0 no-transition"
                aria-label="Download template"
                @click.stop="downloadTemplate"
              >
                <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                Download template
              </UButton>
            </div>
          </UiModernCard>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div v-else class="space-y-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Icon name="i-heroicons-information-circle" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Export Information</h3>
      </div>

      <div class="space-y-6">
        <UiModernAlert
          type="info"
          title="Export Options"
          description="Export all participants from this tournament in your preferred format."
          show-icon
        />

        <!-- Export Format Selection -->
        <div class="space-y-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Format Selection</h3>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Export Format </label>
            <div class="grid grid-cols-3 gap-4">
              <UButton
                v-for="format in exportFormats"
                :key="format.value"
                :variant="selectedFormat === format.value ? 'solid' : 'outline'"
                color="info"
                class="p-4 h-auto flex flex-col items-center space-y-3 shadow-none hover:shadow-none duration-0 no-transition"
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Filename (optional) </label>
            <UInput v-model="exportFilename" class="w-full" placeholder="Leave empty for auto-generated name" />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-4">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ isImport ? 'Processing import...' : 'Preparing export...' }}
            </span>
          </div>
        </div>

        <!-- Error Display -->
        <UAlert v-if="error" color="error" variant="soft" icon="i-heroicons-exclamation-triangle" :title="error" />

        <!-- Success Display -->
        <UAlert
          v-if="successMessage"
          color="success"
          variant="soft"
          icon="i-heroicons-check-circle"
          :title="successMessage"
        />

        <!-- Import Results -->
        <div v-if="importResults" class="space-y-4">
          <UiModernCard variant="glass" size="md" :hover="false">
            <template #header>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">Import Results</h4>
            </template>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center space-x-2">
                <UBadge color="success" variant="soft"> {{ importResults.imported }} imported </UBadge>
              </div>
              <div class="flex items-center space-x-2">
                <UBadge color="error" variant="soft"> {{ importResults.errors?.length ?? 0 }} errors </UBadge>
              </div>
            </div>
          </UiModernCard>

          <!-- Import Errors Details -->
          <UiModernCard
            v-if="importResults.errors && importResults.errors.length > 0"
            variant="glass"
            size="md"
            :hover="false"
          >
            <template #header>
              <h5 class="text-lg font-bold text-gray-900 dark:text-white">Import Errors</h5>
            </template>
            <div class="max-h-32 overflow-y-auto space-y-2">
              <UiModernAlert
                v-for="(importError, index) in importResults.errors"
                :key="index"
                type="error"
                :title="`Row ${importError.row}: ${importError.message}`"
                show-icon
              />
            </div>
          </UiModernCard>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-end space-x-4 pt-6">
    <UButton
      variant="outline"
      :disabled="isLoading"
      color="error"
      class="shadow-none hover:shadow-none duration-0 no-transition"
      @click="closeModal"
    >
      {{ isImport ? 'Cancel' : 'Close' }}
    </UButton>
    <UButton
      v-if="isImport"
      :disabled="!selectedFile || isLoading"
      color="info"
      variant="solid"
      :loading="isLoading"
      icon="i-heroicons-arrow-up-tray"
      class="px-4 py-2 rounded-lg shadow-none hover:shadow-none duration-0 no-transition"
      @click="handleImport"
    >
      Import Participants
    </UButton>
    <UButton
      v-else
      :disabled="isLoading"
      color="info"
      variant="solid"
      :loading="isLoading"
      icon="i-heroicons-arrow-down-tray"
      class="shadow-none hover:shadow-none duration-0 no-transition"
      @click="handleExport"
    >
      Export Participants
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { handleError, handleSuccess } from '~/utils/errorHandler';

interface Props {
  isImport: boolean;
  tournamentId: string;
  tournamentName: string;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: unknown;
}

interface ImportResults {
  success: boolean;
  imported: number;
  errors?: ImportError[];
  warnings?: ImportError[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  importSuccess: [results: ImportResults];
  exportSuccess: [];
  close: [];
}>();

// State
const selectedFile = ref<File | null>(null);
const selectedFormat = ref('csv');
const exportFilename = ref('');
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');
const importResults = ref<ImportResults | null>(null);
const isDragOver = ref(false);
const fileError = ref('');
const fileInput = ref<HTMLInputElement>();

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
];

// Reset state function
const resetState = () => {
  selectedFile.value = null;
  selectedFormat.value = 'csv';
  exportFilename.value = '';
  isLoading.value = false;
  error.value = '';
  successMessage.value = '';
  importResults.value = null;
  isDragOver.value = false;
  fileError.value = '';
};

const closeModal = () => {
  resetState();
  emit('close');
};

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0 && files[0]) {
    handleFile(files[0]);
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files) {
    const files = target.files;
    if (files.length > 0 && files[0]) {
      handleFile(files[0]);
    }
  }
};

const handleFile = (file: File) => {
  // Validate file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!allowedTypes.includes(file.type)) {
    fileError.value = 'Please select a CSV or Excel file';
    return;
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    fileError.value = 'File size must be less than 10MB';
    return;
  }

  selectedFile.value = file;
  fileError.value = '';
};

const removeFile = () => {
  selectedFile.value = null;
  fileError.value = '';
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

type TemplateResponse = {
  success: boolean;
  data: string;
  contentType: string;
  filename: string;
};

type ImportResponse = {
  success: boolean;
  message?: string;
  imported?: number;
  errors?: ImportError[];
  warnings?: ImportError[];
};

const downloadTemplate = async () => {
  try {
    const response = await $fetch<TemplateResponse>('/api/export/template', {
      method: 'POST',
      body: {
        type: 'competitor',
        format: 'csv',
      },
    });

    if (response.success) {
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'participants_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (err: unknown) {
    handleError(err, 'Error downloading template', 'Download Error');
    error.value = 'Failed to download template';
  }
};

const handleImport = async () => {
  if (!selectedFile.value) return;

  isLoading.value = true;
  error.value = '';
  successMessage.value = '';
  importResults.value = null;

  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('tournamentId', props.tournamentId);

    const response = await $fetch<ImportResponse>('/api/import/competitors', {
      method: 'POST',
      body: formData,
    });

    if (response.success) {
      successMessage.value = response.message || 'Import successful';
      importResults.value = {
        success: true,
        imported: response.imported ?? 0,
        errors: Array.isArray(response.errors) ? response.errors : [],
        warnings: Array.isArray(response.warnings) ? response.warnings : [],
      };
      handleSuccess(`Successfully imported ${response.imported ?? 0} participants`, 'Import Success');
      emit('importSuccess', importResults.value);
    } else {
      error.value = response.message ?? 'Import failed';
      importResults.value = {
        success: false,
        imported: response.imported ?? 0,
        errors: Array.isArray(response.errors) ? response.errors : [],
        warnings: Array.isArray(response.warnings) ? response.warnings : [],
      };
    }
  } catch (err: unknown) {
    handleError(err, 'Import error', 'Import Failed');
    error.value = (err as { data?: { message?: string } })?.data?.message || 'Import failed';
  } finally {
    isLoading.value = false;
  }
};

const handleExport = async () => {
  isLoading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const filename =
      exportFilename.value || `tournament_${props.tournamentId}_participants_${new Date().toISOString().split('T')[0]}`;

    const response = (await $fetch('/api/export/competitors', {
      method: 'POST',
      body: {
        tournamentId: props.tournamentId,
        format: selectedFormat.value,
        filename: exportFilename.value ?? undefined,
      },
      responseType: 'blob',
    })) as unknown as Blob;

    // Create blob and trigger download
    const blob = new Blob([response], {
      type:
        selectedFormat.value === 'csv'
          ? 'text/csv'
          : selectedFormat.value === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${selectedFormat.value}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    successMessage.value = `Export completed successfully. File downloaded.`;
    handleSuccess('Export completed successfully', 'Export Success');
    emit('exportSuccess');
  } catch (err: unknown) {
    handleError(err, 'Export error', 'Export Failed');
    error.value = (err as { data?: { message?: string } })?.data?.message || 'Export failed';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.no-transition,
.no-transition * {
  transition: none !important;
  transform: none !important;
}
</style>
