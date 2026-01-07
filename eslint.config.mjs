import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-plugin-prettier';

export default withNuxt({
  name: 'nuxt/all-presets',
  plugins: {
    prettier,
  },
  linterOptions: {
    reportUnusedDisableDirectives: 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
      alias: {
        map: [
          ['~', '.'],
          ['~/', './'],
          ['@', '.'],
          ['@/', './'],
          ['~~', '.'],
          ['@@', '.'],
          ['#', '.'],
          ['#imports', './.nuxt/imports.d.ts'],
          ['#components', './components'],
          ['#composables', './composables'],
          ['#utils', './utils'],
          ['#assets', './assets'],
          ['#public', './public'],
          ['#server', './server'],
          ['#types', './types'],
          ['#stores', './stores'],
          ['#middleware', './middleware'],
          ['#plugins', './plugins'],
          ['#layouts', './layouts'],
          ['#pages', './pages'],
          ['#app', './app'],
        ],
        extensions: ['.ts', '.js', '.vue', '.json', '.mjs', '.tsx', '.jsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json', '.mjs'],
        moduleDirectory: ['node_modules', 'server', 'lib', 'utils', 'types'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.vue'],
    },
  },
  ignores: [
    'node_modules/**',
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'build/**',
    '.eslintcache',
    '*.cache',
    '.temp/**',
    '.tmp/**',
    'logs/**',
    '*.log',
    '*.db',
    '*.sqlite',
    '.env*',
    '!.env.example',
    'coverage/**',
    '.DS_Store',
    'Thumbs.db',
    '.vscode/**',
    '.idea/**',
    '*.swp',
    '*.swo',
    'public/**',
    'assets/**',
    'prisma/migrations/**',
  ],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',

    'import/extensions': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{js,ts,vue}',
          '**/*.spec.{js,ts,vue}',
          '**/tests/**',
          '**/test/**',
          '**/__tests__/**',
          '**/vitest.config.*',
          '**/playwright.config.*',
          '**/vite.config.*',
          '**/nuxt.config.*',
          '**/eslint.config.*',
          '**/tailwind.config.*',
          '**/check-db.*',
          '**/scripts/**',
          '**/prisma/**',
          '**/server/**',
          '**/lib/**',
          '**/types/**',
          '**/utils/**',
          '**/stores/**',
          '**/composables/**',
          '**/middleware/**',
          '**/plugins/**',
          '**/layouts/**',
          '**/pages/**',
          '**/components/**',
          '**/assets/**',
          '**/public/**',
          '**/app/**',
        ],
      },
    ],

    // Vue rules
    'vue/max-attributes-per-line': 'off',
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-spacing': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/html-comment-content-spacing': ['error', 'always'],
    'vue/html-comment-indent': ['error', 2],
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    'vue/no-empty-component-block': 'error',
    'vue/no-static-inline-styles': 'error',
    'vue/no-template-target-blank': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/prefer-separate-static-class': 'error',
    'vue/prefer-true-attribute-shorthand': 'error',
    'vue/require-direct-export': 'error',
    'vue/v-for-delimiter-style': ['error', 'in'],
    'vue/v-on-event-hyphenation': ['error', 'always'],
    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'v-slot',
        default: 'shorthand',
        named: 'shorthand',
      },
    ],

    // Prettier integration
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
        trailingComma: 'es5',
        printWidth: 120,
        endOfLine: 'lf',
        arrowParens: 'avoid',
        bracketSpacing: true,
        bracketSameLine: false,
        quoteProps: 'as-needed',
        vueIndentScriptAndStyle: false,
      },
    ],

    // Basic formatting rules (disabled to let Prettier handle formatting)
    indent: 'off',
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: ['error', 'always'],
    'comma-dangle': 'off', // Let Prettier handle this
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'space-infix-ops': 'error',
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
        maxEOF: 1,
      },
    ],
    'max-len': 'off', // Disabled to focus on other formatting issues
  },
});
