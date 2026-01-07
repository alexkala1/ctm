import { defineStore } from 'pinia';
import type { User, LoginCredentials, RegisterData, AuthResult } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);
  const isAdmin = computed(() => user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN');

  // Actions - using direct API calls (no h3, no sidebase/nuxt-auth)
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    isLoading.value = true;
    try {
      const response = (await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })) as { success: boolean; data?: { user: User; token: string }; error?: string };

      if (response.success && response.data?.user) {
        user.value = response.data.user;
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (credentials: RegisterData): Promise<AuthResult> => {
    isLoading.value = true;
    try {
      const response = (await $fetch('/api/auth/register', {
        method: 'POST',
        body: credentials,
      })) as { success: boolean; data?: { user: User }; error?: string };

      if (response.success && response.data?.user) {
        user.value = response.data.user;
        await navigateTo('/');
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
    } catch (error: unknown) {
      console.error('Logout error:', error);
    } finally {
      user.value = null;
      await navigateTo('/auth/login');
    }
  };

  const checkAuth = async (): Promise<void> => {
    try {
      const response = (await $fetch('/api/auth/me')) as { success: boolean; data?: { user: any } };

      if (response.success && response.data?.user) {
        // Trust server-provided role/status, don't override SUPER_ADMIN
        user.value = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || response.data.user.email,
          role: (response.data.user as any).role || 'USER',
          status: (response.data.user as any).status || 'APPROVED',
          provider: (response.data.user as any).provider,
        } as User;
      } else {
        user.value = null;
      }
    } catch (error: unknown) {
      console.error('Auth check error:', error);
      user.value = null;
    }
  };

  // OAuth methods - using direct browser redirects
  const signInWithGoogle = async (): Promise<AuthResult> => {
    isLoading.value = true;
    try {
      // Redirect to OAuth endpoint using browser navigation
      const currentPath = useRoute().path;
      window.location.href = `/api/auth/google/redirect?redirectTo=${encodeURIComponent(currentPath)}`;
      return { success: true };
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google sign-in failed',
      };
    } finally {
      isLoading.value = false;
    }
  };

  const signInWithGitHub = async (): Promise<AuthResult> => {
    isLoading.value = true;
    try {
      // Redirect to OAuth endpoint using browser navigation
      const currentPath = useRoute().path;
      window.location.href = `/api/auth/github/redirect?redirectTo=${encodeURIComponent(currentPath)}`;
      return { success: true };
    } catch (error: unknown) {
      console.error('GitHub sign-in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'GitHub sign-in failed',
      };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    isAdmin,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    signInWithGoogle,
    signInWithGitHub,
  };
});
