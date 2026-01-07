import { defineStore } from 'pinia';
import type { Notification, NotificationInput } from '~/types';

export const useUIStore = defineStore('ui', () => {
  // State
  const activeNotifications = ref<Notification[]>([]);
  const isLoading = ref(false);
  const theme = ref<'light' | 'dark' | 'system'>('system');
  const sidebarOpen = ref(false);

  // Computed
  const isDark = computed(() => {
    if (theme.value === 'system') {
      return import.meta.client && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme.value === 'dark';
  });

  // Actions
  const showNotification = (notification: NotificationInput): void => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };

    activeNotifications.value.push(newNotification);

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        dismissNotification(id);
      }, newNotification.duration);
    }
  };

  const dismissNotification = (id: string): void => {
    activeNotifications.value = activeNotifications.value.filter(n => n.id !== id);
  };

  const clearAllNotifications = (): void => {
    activeNotifications.value = [];
  };

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading;
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system'): void => {
    theme.value = newTheme;
    if (import.meta.client) {
      localStorage.setItem('ctm-color-mode', newTheme);
      updateTheme();
    }
  };

  const toggleSidebar = (): void => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const setSidebarOpen = (open: boolean): void => {
    sidebarOpen.value = open;
  };

  // Convenience methods for different notification types
  const showSuccess = (message: string, title?: string): void => {
    showNotification({
      type: 'success',
      title: title || 'Success',
      message,
      duration: 5000,
    });
  };

  const showError = (message: string, title?: string): void => {
    showNotification({
      type: 'error',
      title: title || 'Error',
      message,
      duration: 8000,
    });
  };

  const showWarning = (message: string, title?: string): void => {
    showNotification({
      type: 'warning',
      title: title || 'Warning',
      message,
      duration: 6000,
    });
  };

  const showInfo = (message: string, title?: string): void => {
    console.log('showInfo called with:', { message, title });
    console.log('Current notifications before:', activeNotifications.value.length);
    showNotification({
      type: 'info',
      title: title || 'Info',
      message,
      duration: 5000,
    });
    console.log('Current notifications after:', activeNotifications.value.length);
  };

  const updateTheme = (): void => {
    if (import.meta.client) {
      const root = document.documentElement;
      const isDarkMode = isDark.value;

      root.classList.remove('light', 'dark');
      root.classList.add(isDarkMode ? 'dark' : 'light');
      root.setAttribute('data-color-mode', isDarkMode ? 'dark' : 'light');
    }
  };

  const initialize = (): void => {
    // Initialize UI state
    activeNotifications.value = [];
    isLoading.value = false;
    sidebarOpen.value = false;

    // Load theme from localStorage
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('ctm-color-mode') as 'light' | 'dark' | 'system' | null;
      if (savedTheme) {
        theme.value = savedTheme;
      }
      updateTheme();

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
    }
  };

  return {
    // State
    activeNotifications: readonly(activeNotifications),
    isLoading: readonly(isLoading),
    theme: readonly(theme),
    sidebarOpen: readonly(sidebarOpen),
    // Computed
    isDark,
    // Actions
    showNotification,
    dismissNotification,
    clearAllNotifications,
    setLoading,
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    updateTheme,
    initialize,
    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
});

// Export for compatibility
export const useUI = useUIStore;
