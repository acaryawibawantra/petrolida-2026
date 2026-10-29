# AI Agent Guide

## 1. Project Overview
This repository is the frontend for Petrolida 2026. It is a Next.js 16 (App Router) React 19 TypeScript application with Tailwind CSS and shadcn/ui primitives. Client data fetching is handled with React Query and Axios. Local state is managed with Zustand. Validation is done with Zod. Formatting and linting are enforced by Biome, with Git hooks via Husky and commit conventions via Commitlint.

Core stack summary:
- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- React Query v5 for server state
- Zustand for client state
- Axios for API requests
- Zod for validation
- Biome for lint/format
- Husky + lint-staged + commitlint for workflow

## 2. Project Structure
Top-level layout (abbreviated):
```text
.
├─ .github/                 CI and repo metadata
├─ .husky/                  Git hooks
├─ .next/                   Next.js build output (generated)
├─ public/                  Static assets
├─ src/                     Application source
├─ Dockerfile.dev           Dev container image
├─ Dockerfile.prod          Prod container image
├─ biome.json               Lint/format configuration
├─ commitlint.config.js     Commit message rules
├─ components.json          shadcn/ui configuration
├─ next.config.js           Next.js configuration
├─ package.json             Scripts and dependencies
├─ postcss.config.js        PostCSS configuration
├─ tailwind.config.ts       Tailwind configuration
└─ tsconfig.json            TypeScript configuration
```

`src/` layout:
```text
src/
├─ app/                     Next.js App Router routes, layouts, providers
├─ components/              Reusable UI and feature components
├─ constants/               App constants and configuration data
├─ data/                    Static data sets
├─ hooks/                   React Query hooks and feature hooks
├─ layouts/                 Shared layout components (Navbar, Footer)
├─ lib/                     Shared utilities (API client, helpers)
├─ services/                API service layer (Axios calls)
├─ stores/                  Zustand state stores
├─ types/                   Shared TypeScript types
├─ utils/                   Utility helpers
└─ validation/              Zod schemas for form/input validation
```

## 3. API Development Best Practices
This project is a frontend that consumes a backend API. There are no local Next.js API routes yet.

Standards for new endpoints:
- Create service functions in `src/services/*.ts`.
- Use the shared Axios instance from `src/lib/api.ts`.
- Keep service functions focused on HTTP calls only.
- Add corresponding React Query hooks in `src/hooks/*`.

Error handling patterns:
- Axios errors are normalized in `src/lib/api.ts` interceptor.
- UI feedback is typically handled in hooks using `sonner` toasts.
- Prefer returning `response.data` from services and let hooks format UX errors.

Request/Response validation:
- Define Zod schemas in `src/validation/*.ts`.
- Use Zod schemas for form validation (typically with `react-hook-form` + resolvers).
- Keep API response typing in `src/types/api.ts` and entity typing in `src/types/entity/*`.

Authentication and middleware:
- Auth token is stored in cookies (`src/lib/cookies.ts`) and attached in Axios interceptor (`src/lib/api.ts`).
- Next.js middleware exists in `src/middleware.ts` but currently acts as a pass-through.
- If adding auth guards, keep SSR vs client usage in mind, and prefer middleware for route protection.

If you introduce Next.js Route Handlers later:
- Add them under `src/app/api/*/route.ts`.
- Keep handler logic thin and call shared service modules where possible.
- Mirror request/response types in `src/types` and validate inputs with Zod.

## 4. Component Architecture
Guidelines for components:
- Use functional React components.
- Prefer small, composable UI primitives in `src/components/ui`.
- Feature components live in `src/components/` or in route segments under `src/app`.
- Layout-level components live in `src/layouts`.

Naming conventions:
- Components and hooks: `PascalCase` for component files, `use-*.ts(x)` for hooks.
- Route segments: `kebab-case` in `src/app` (Next.js convention).
- Utilities and helpers: `kebab-case` or `camelCase` depending on existing file style.

Styling methodology:
- Tailwind CSS is the primary styling system.
- Use `cn()` from `src/lib/utils.ts` for class composition.
- Use shadcn/ui components in `src/components/ui` as the base for UI primitives.

State management:
- Server state: React Query in `src/hooks` (query keys + mutation handlers).
- Client state: Zustand stores in `src/stores`.
- Keep mutation side effects (toasts, cache invalidation) in hooks, not components.

## 5. Coding Standards & Workflow
Linting and formatting:
- Biome is the single source of truth.
- Run `bun run lint`, `bun run check`, or `bun run format`.
- `lint-staged` runs `bun run typecheck`, `bun run check:write`, and `bun run format:write` on staged files.

Commit message conventions:
- Conventional Commits are required via `commitlint.config.js`.
- Allowed types include: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `ci`, `test`, `revert`, `perf`, `vercel`.

Testing requirements:
- No unit/integration test runner is currently configured.
- Current validation relies on `bun run typecheck` and Biome checks.
- If a test framework is added, update this guide to reflect it.

## 6. AI Agent Instructions
When generating or modifying code, follow these rules:
- Match existing patterns: `service → hook → component`.
- Prefer `@/` path aliases over relative imports.
- Put API calls in `src/services`, not directly in components.
- Keep React Query cache invalidation and toast messages in hooks.
- Add or update Zod schemas in `src/validation` for any new forms.
- Type API responses using `src/types/api.ts` and domain types in `src/types/entity/*`.
- Use Tailwind classes and `cn()` instead of introducing new styling systems.
- Use existing UI primitives from `src/components/ui` before building new ones.
- Do not introduce new frameworks, state libraries, or testing tools without explicit approval.
- Keep changes consistent with Biome formatting and TypeScript strictness.
