// Auto-imports: useUIStore (from Pinia)

/**
 * Centralized error handling utility that converts console logs to toast notifications
 */

let uiStore: ReturnType<typeof useUIStore> | null = null

function getUIStore() {
  if (!uiStore) {
    uiStore = useUIStore()
  }
  return uiStore
}

/**
 * Handle errors with toast notifications instead of console logs
 */
export function handleError(
  error: unknown,
  context?: string,
  title?: string
): void {
  const store = getUIStore()

  // Extract error message
  let message = 'An unexpected error occurred'
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  }

  // Add context if provided
  if (context) {
    message = `${context}: ${message}`
  }

  // Show error toast
  store.showError(message, title)

  // Still log to console in development for debugging
}

/**
 * Handle warnings with toast notifications
 */
export function handleWarning(
  message: string,
  context?: string,
  title?: string
): void {
  const store = getUIStore()

  if (context) {
    message = `${context}: ${message}`
  }

  store.showWarning(message, title)

  // Still log to console in development
}

/**
 * Handle info messages with toast notifications
 */
export function handleInfo(
  message: string,
  context?: string,
  title?: string
): void {
  const store = getUIStore()

  if (context) {
    message = `${context}: ${message}`
  }

  store.showInfo(message, title)

  // Still log to console in development
}

/**
 * Handle success messages with toast notifications
 */
export function handleSuccess(
  message: string,
  context?: string,
  title?: string
): void {
  const store = getUIStore()

  if (context) {
    message = `${context}: ${message}`
  }

  store.showSuccess(message, title)

  // Still log to console in development
}

/**
 * Create a safe async function wrapper that handles errors automatically
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  context?: string,
  fallbackValue?: T
): Promise<T | undefined> {
  try {
    return await asyncFn()
  } catch (error) {
    handleError(error, context)
    return fallbackValue
  }
}

/**
 * Create a safe function wrapper that handles errors automatically
 */
export function safe<T>(
  fn: () => T,
  context?: string,
  fallbackValue?: T
): T | undefined {
  try {
    return fn()
  } catch (error) {
    handleError(error, context)
    return fallbackValue
  }
}
