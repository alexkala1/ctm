// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';

// @ts-expect-error - ignore type errors
export default defineNuxtConfig({
  ssr: false, // Disable SSR - run as SPA

  // Precompilation and loading optimizations
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  // Vite optimizations
  vite: {
    resolve: {
      alias: {
        // Ensure absolute paths and support both with and without trailing slash
        '~': fileURLToPath(new URL('.', import.meta.url)),
        '~/': fileURLToPath(new URL('.', import.meta.url)),
        '@': fileURLToPath(new URL('.', import.meta.url)),
        '@/': fileURLToPath(new URL('.', import.meta.url)),
        '~~': fileURLToPath(new URL('.', import.meta.url)),
        '@@': fileURLToPath(new URL('.', import.meta.url)),
        '#': fileURLToPath(new URL('.', import.meta.url)),
        '#/': fileURLToPath(new URL('.', import.meta.url)),
        // App directory aliases
        '~/app': fileURLToPath(new URL('./app', import.meta.url)),
        '~/app/': fileURLToPath(new URL('./app', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
  },

  // Auto-imports configuration
  imports: {
    dirs: [
      'composables/**',
      'utils/**',
      'stores/**',
      'types/**',
      'app/components/**',
      'app/composables/**',
      'app/utils/**',
      'app/stores/**',
      'app/types/**',
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    'nuxt-viewport',
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**'],
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Chess Tournament Manager',
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icon.svg' },
        { rel: 'shortcut icon', href: '/favicon.svg' },
        // Google Fonts for multilingual support
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&family=Noto+Sans+Greek:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
  css: ['../assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'ctm-color-mode',
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
  compatibilityDate: '2025-07-15',

  // Loading configuration
  loading: {
    color: '#3b82f6', // primary color
    height: '4px',
    throttle: 200,
    duration: 5000,
    continuous: true,
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false,
  },
  veeValidate: {
    autoImport: true,
    formComponent: 'UForm',
    inputComponent: 'UInput',
    selectComponent: 'USelect',
    submitButtonComponent: 'UButton',
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'gr', language: 'gr-GR' },
    ],
    defaultLocale: 'en',
  },
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: [
        '/',
        '/tournaments',
        '/tournaments/**',
        '/api',
        '/api/**',
        '/support',
        '/privacy',
        '/terms',
        '/auth',
        '/auth/**',
        '/ui-demo',
      ],
    },
  },
  viewport: {
    breakpoints: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },
    fallbackBreakpoint: 'lg',
  },
});
