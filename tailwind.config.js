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
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        greek: ['Noto Sans Greek', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
