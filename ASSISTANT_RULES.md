# 🤖 AI Coding Guidelines for Nuxt 4 Project

This document defines the rules and practices all AI coding agents (e.g., Claude, ChatGPT) must follow to ensure code is consistent, maintainable, and aligned with official documentation.

---

## 🔑 General Principles

- **Documentation first**: Always follow official documentation for Nuxt, Vue, Prisma, Supabase, Pinia, Tailwind, etc.
- **Consistency over creativity**: Reuse proven patterns; avoid ad-hoc solutions.
- **Type-safe and validated**: All data must be typed and validated with `zod` or `yup`.
- **Nuxt conventions**: Respect Nuxt’s auto-imports and folder structure.

---

## 📂 Project Structure

- `pages/` → Route views (minimal logic).
- `layouts/` → Shared wrappers.
- `components/` → UI building blocks.
- `composables/` → Reusable logic functions.
- `stores/` → Pinia state management.
- `server/api/` → API routes with validation + Prisma.
- `server/utils/` → Server-side helpers.

**Rule**: Business logic goes in `composables/` or `stores/`, never directly in components.

---

## 🟦 TypeScript

- Define types in `/types`.
- No `any`. Use `unknown` + narrowing.
- Use `zod`/`yup` schemas for external data.
- `tsconfig.json` must stay in `strict` mode.

---

## 📦 State Management (Pinia)

- One store per domain (e.g., `useAuthStore`).
- Use `pinia-plugin-persistedstate` for persistence.
- Only persist serializable state.
- Mutations only inside store actions.

---

## 📝 Forms & Validation

- Use **vee-validate** + `@vee-validate/zod`.
- Validate both client and server side.
- Example:

  ```ts
  const schema = toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  ```

---

## 🛠 Backend & Data

### Supabase

- Use for **auth, storage, realtime**.
- Do not query DB directly from frontend.

### Prisma

- Use for structured database queries.
- Wrap queries in `server/api/` routes.
- Always validate requests with `zod`.

### API Routes

- Place in `server/api/*.ts`.
- Must:
  - Parse + validate body.
  - Handle errors.
  - Return `{ data, error }` consistently.

---

## 🎨 UI & Styling

- Use `@nuxt/ui` first (`<UButton>`, `<UCard>`).
- Use **TailwindCSS** for styling.
- Use `@tailwindcss/forms` for form controls.
- Respect `@nuxtjs/color-mode` (dark/light theme).

### CSS Spacing & Conflicts

**⚠️ CRITICAL: Nuxt UI CSS Override Issues**

Nuxt UI has higher CSS specificity that overrides certain Tailwind spacing classes:

**❌ Classes that DON'T work reliably:**

- `p-5`, `px-5`, `py-5`, `pt-5`, `pb-5`, `pl-5`, `pr-5` (1.25rem)
- Some `m-5` variants
- `gap-5` in some contexts

**✅ Classes that work reliably:**

- `p-4`, `px-4`, `py-4` (1rem)
- `p-6`, `px-6`, `py-6` (1.5rem)
- `p-8`, `px-8`, `py-8` (2rem)
- All other standard Tailwind spacing values

**🔧 Solutions for problematic spacing:**

1. **Use arbitrary values** (recommended):

   ```css
   class="px-[1.25rem]"  // Instead of px-5
   class="p-[1.25rem]"   // Instead of p-5
   ```

2. **Use important modifier**:

   ```css
   class="!px-5"  // Forces the style
   ```

3. **Use inline styles** (last resort):
   ```css
   style="padding-left: 1.25rem; padding-right: 1.25rem;"
   ```

**📏 Recommended spacing scale:**

- `space-y-2` → `space-y-3` → `space-y-4` → `space-y-6` → `space-y-8`
- `p-4` → `p-6` → `p-8` (avoid `p-5`)
- `px-4` → `px-6` → `px-8` (avoid `px-5`)
- `gap-4` → `gap-6` → `gap-8` (avoid `gap-5`)

**🔍 Debugging spacing issues:**

1. Check browser DevTools computed styles
2. Look for Nuxt UI CSS overrides
3. Test with arbitrary values first
4. Use `!important` modifier if needed

---

## 🌍 Internationalization

- Use `@nuxtjs/i18n`.
- Never hardcode strings; use `$t('key')`.
- Keep translations in `/locales/*.json`.

---

## 🛡 Error Handling & Monitoring

- Use `@sentry/nuxt` for error tracking.
- API routes:
  - Catch errors → return `{ error: message }`.
  - Do not expose stack traces.

- Frontend → friendly messages only.

---

## 📅 Date & Time

- Prefer **date-fns**.
- Use **dayjs** for relative time only.
- Store dates as ISO strings, not `Date` objects, in state.

---

## 🧰 Utilities

- `lodash-es` → deep operations.
- `papaparse` → CSV import/export.
- `xlsx` → Excel export.
- `file-saver`, `jspdf`, `jspdf-autotable` → file/PDF generation.

### CommonJS Module Import Issues

**⚠️ CRITICAL: CommonJS Module Import Patterns**

Some packages are CommonJS modules and don't support named exports in ES modules:

**❌ Don't use (causes errors):**

```typescript
import { saveAs } from 'file-saver' // Named export not supported
```

**✅ Correct patterns:**

```typescript
// For file-saver
import * as FileSaver from 'file-saver'
FileSaver.saveAs(blob, filename)

// For jspdf-autotable
import autoTable from 'jspdf-autotable'
autoTable(doc, options)

// For other CommonJS modules
import * as PackageName from 'package-name'
PackageName.functionName()
```

**🔍 CommonJS packages in this project:**

- `file-saver` → Use `import * as FileSaver from 'file-saver'`
- `jspdf-autotable` → Use `import autoTable from 'jspdf-autotable'`
- `papaparse` → Use `import * as Papa from 'papaparse'`

---

## 🧪 Testing

- Unit tests: **Vitest** (`vitest`, `@vitest/ui`).
- Component tests: `@testing-library/vue` + `@vue/test-utils`.
- E2E: **Playwright**.
- Mock APIs: **MSW**.
- Accessibility: **axe-core**.

---

## 🧹 Code Quality

- Lint with `@nuxt/eslint`.
- Format with **Prettier**.
- Accessibility checks: `eslint-plugin-jsx-a11y`.
- CI must run `eslint`, `prettier --check`, `vitest`.

---

## 🔒 Security

- Validate all input (client + server) with `zod`.
- Keep secrets in `.env`.
- Enforce Supabase Row-Level Security (RLS).
- Sanitize all uploads.

---

# ✅ Golden Rules for Claude

1. **Start with official docs** for every dependency.
2. **Respect Nuxt conventions** over custom structures.
3. **Never skip validation** (zod/vee-validate).
4. **Keep logic layered correctly** (UI ↔ Composables ↔ API ↔ DB).
5. **Ask for clarification** instead of guessing when uncertain.

---
