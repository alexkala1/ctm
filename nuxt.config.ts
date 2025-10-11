// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Disable SSR - run as SPA
  
  // Precompilation and loading optimizations
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  
  // Vite optimizations
  vite: {
    resolve: {
      alias: {
        "~": ".",
        "@": ".",
        "~~": ".",
        "@@": ".",
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router']
          }
        }
      }
    }
  },
  
  alias: {
    "~": ".",
    "@": ".",
    "~~": ".",
    "@@": ".",
  },
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/test-utils/module',
    '@sentry/nuxt/module',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    'nuxt-viewport',
    '@sidebase/nuxt-auth',
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**'],
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Chess Tournament Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icon.svg' },
        { rel: 'shortcut icon', href: '/favicon.svg' },
        // Google Fonts for multilingual support
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&family=Noto+Sans+Greek:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },
  css: ['../assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'ctm-color-mode'
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
    continuous: true
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
        '/auth/**'
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

  // Auth configuration
  auth: {
    // Use same-origin for auth API during dev and prod
    baseURL: process.env.AUTH_ORIGIN || '',
    provider: {
      type: 'local',
      endpoints: {
        getSession: { path: '/api/auth/me' },
        signIn: { path: '/api/auth/login' },
        signOut: { path: '/api/auth/logout' },
        getCsrfToken: { path: '/api/auth/csrf' }
      },
      pages: {
        login: '/auth/login'
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        type: 'Bearer',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 24 * 7, // 7 days
        sameSiteAttribute: 'strict'
      },
      sessionDataType: {
        id: 'string',
        email: 'string',
        name: 'string',
        role: 'string',
        status: 'string',
        avatarUrl: 'string',
        provider: 'string',
        lastLoginAt: 'string'
      }
    }
  },
})
