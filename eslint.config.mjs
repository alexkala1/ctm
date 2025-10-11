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
      // Only add custom overrides here if needed
      // The base Nuxt presets are already included by withNuxt()
    },
  },
)
