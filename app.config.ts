export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      neutral: 'neutral',
    },
    alert: {
      wrapper:
        'group relative rounded-2xl border-2 backdrop-blur-sm transition-all duration-200 ease-in-out hover:scale-[1.02] overflow-hidden',
      container: 'flex p-6 relative z-10',
      icon: {
        base: 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
        color: {
          white: 'text-white',
          gray: 'text-gray-500 dark:text-gray-400',
          primary: 'text-white',
          secondary: 'text-white',
          success: 'text-white',
          warning: 'text-white',
          error: 'text-white',
          info: 'text-white',
          neutral: 'text-white',
        },
      },
      title: 'text-lg font-bold mb-2',
      description: 'opacity-90',
      actions: 'mt-2 flex space-x-2',
      close: {
        base: 'flex-shrink-0 ml-4',
        icon: 'w-4 h-4',
      },
      color: {
        white: {
          wrapper:
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)]',
          icon: 'bg-gray-500',
          title: 'text-gray-800 dark:text-gray-200',
          description: 'text-gray-700 dark:text-gray-300',
        },
        gray: {
          wrapper:
            'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)]',
          icon: 'bg-gray-500',
          title: 'text-gray-800 dark:text-gray-200',
          description: 'text-gray-700 dark:text-gray-300',
        },
        primary: {
          wrapper:
            'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_12px_40px_0_rgba(59,130,246,0.3)]',
          icon: 'bg-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)]',
          title: 'text-blue-800 dark:text-blue-200',
          description: 'text-blue-700 dark:text-blue-300',
        },
        secondary: {
          wrapper:
            'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] hover:shadow-[0_12px_40px_0_rgba(168,85,247,0.3)]',
          icon: 'bg-purple-500 shadow-[0_4px_12px_rgba(168,85,247,0.3)]',
          title: 'text-purple-800 dark:text-purple-200',
          description: 'text-purple-700 dark:text-purple-300',
        },
        success: {
          wrapper:
            'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 shadow-[0_8px_32px_0_rgba(34,197,94,0.2)] hover:shadow-[0_12px_40px_0_rgba(34,197,94,0.3)]',
          icon: 'bg-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.3)]',
          title: 'text-green-800 dark:text-green-200',
          description: 'text-green-700 dark:text-green-300',
        },
        warning: {
          wrapper:
            'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700 shadow-[0_8px_32px_0_rgba(245,158,11,0.2)] hover:shadow-[0_12px_40px_0_rgba(245,158,11,0.3)]',
          icon: 'bg-yellow-500 shadow-[0_4px_12px_rgba(245,158,11,0.3)]',
          title: 'text-yellow-800 dark:text-yellow-200',
          description: 'text-yellow-700 dark:text-yellow-300',
        },
        error: {
          wrapper:
            'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700 shadow-[0_8px_32px_0_rgba(239,68,68,0.2)] hover:shadow-[0_12px_40px_0_rgba(239,68,68,0.3)]',
          icon: 'bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)]',
          title: 'text-red-800 dark:text-red-200',
          description: 'text-red-700 dark:text-red-300',
        },
        info: {
          wrapper:
            'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_12px_40px_0_rgba(59,130,246,0.3)]',
          icon: 'bg-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)]',
          title: 'text-blue-800 dark:text-blue-200',
          description: 'text-blue-700 dark:text-blue-300',
        },
        neutral: {
          wrapper:
            'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-700 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)]',
          icon: 'bg-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          title: 'text-gray-800 dark:text-gray-200',
          description: 'text-gray-700 dark:text-gray-300',
        },
      },
    },
  },
})
