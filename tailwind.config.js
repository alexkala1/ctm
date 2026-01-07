/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './pages/**/*.{js,vue,ts}',
    './layouts/**/*.{js,vue,ts}',
    './plugins/**/*.{js,vue,ts}',
    './error.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      // Custom colors for chess-specific elements
      colors: {
        chess: {
          light: '#f0d9b5',
          dark: '#b58863',
          piece: '#2d3748',
          highlight: '#fbbf24',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans',
          'Roboto',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['Playfair Display', 'Noto Serif', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        greek: ['Noto Sans Greek', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        strong: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.3)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neu-inset': 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.1)',
        'neu-outset': '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.1)',
        'neu-strong': '4px 4px 8px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-warning': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-error': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
      },
      backdropBlur: {
        glass: '10px',
        'glass-strong': '20px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
