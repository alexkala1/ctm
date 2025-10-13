import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // All Nuxt ESLint rule presets - using the actual presets from @nuxt/eslint-config
  {
    name: 'nuxt/all-presets',
    // This will automatically include all available Nuxt ESLint presets:
    // - nuxt/javascript
    // - nuxt/typescript/setup
    // - nuxt/typescript/rules
    // - nuxt/vue/setup
    // - nuxt/vue/rules
    // - nuxt/import/rules
    // - nuxt/setup
    // - nuxt/rules
    // - nuxt/vue/single-root
    // - nuxt/disables/routes
    // - nuxt/import-globals
    rules: {
      // Vue 3 recommended formatting rules
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 1 },
        multiline: { max: 1 }
      }],
      'vue/html-indent': ['error', 2],
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always'
      }],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/html-comment-content-spacing': ['error', 'always'],
      'vue/html-comment-indent': ['error', 2],
      'vue/block-lang': ['error', {
        script: {
          lang: 'ts'
        }
      }],
      'vue/block-order': ['error', {
        order: ['template', 'script', 'style']
      }],
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
      'vue/v-slot-style': ['error', {
        atComponent: 'v-slot',
        default: 'shorthand',
        named: 'shorthand'
      }]
    },
  },
)
