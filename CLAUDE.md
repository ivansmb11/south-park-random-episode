# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vue 3 + TypeScript + Vite web app for discovering random South Park episodes. Uses the TMDB API for episode data (series ID: **2190**) and Supabase for authentication and daily episode storage.

## Development Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type check (vue-tsc -b) then Vite build
npm run preview   # Preview production build
```

No test runner or linter is configured.

## Environment Variables

Defined in `.env`, prefixed with `VITE_` for client-side access:

- `VITE_BACKEND_URL` — TMDB API base URL (`https://api.themoviedb.org/3`)
- `VITE_API_KEY` — TMDB API key (passed as `api_key` query param)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous/public key

## Architecture

**Stack:** Vue 3 Composition API (`<script setup>`), Pinia, Vue Router, Axios, Tailwind CSS 4, shadcn-vue (reka-ui based), Supabase, Zod, vee-validate, @vueuse/motion, vue-sonner

**Path alias:** `@/*` → `src/*`

### Layers

```
src/
├── core/
│   ├── schemas/             # Zod schemas (source of truth for types)
│   ├── entities/            # Re-export types + schemas from schemas/
│   └── use-cases/
│       ├── movie-db/        # TMDB API calls (episodes, random, paginated)
│       ├── auth/            # Supabase auth (Google OAuth, profile CRUD)
│       └── daily-episode/   # Daily episode (Supabase DB query + edge function)
├── config/
│   ├── adapters/            # HTTP adapter pattern (HttpAdapter → AxiosAdapter)
│   ├── supabase.ts          # Supabase client instance
│   └── assets.bucket.ts     # GCS URLs for static character images
├── stores/                  # Pinia stores (episodes, background, auth)
├── composables/             # useTheme, useEpisodeCache, useDailyEpisode
├── views/                   # Route-level page components
├── components/              # App components + ui/ (shadcn-vue primitives)
├── lib/                     # TMDB image URL builder, Tailwind cn() helper
└── router/                  # Vue Router with auth guards
```

### Schema → Entity Pattern

Zod schemas in `src/core/schemas/` are the single source of truth. Entity files in `src/core/entities/` re-export types and schemas:

```typescript
// schemas/profile.schema.ts — defines schema + inferred types
export const UserProfileSchema = z.object({ ... })
export type UserProfile = z.infer<typeof UserProfileSchema>

// entities/profile.entity.ts — re-exports
export type { UserProfile } from '@/core/schemas/profile.schema'
export { UserProfileSchema } from '@/core/schemas/profile.schema'
```

**Constraint:** Must use zod v3 (not v4) due to @vee-validate/zod peer dependency.

### HTTP Adapter Pattern

Abstract `HttpAdapter` → `AxiosAdapter`. A `backendFetcher` instance targets TMDB with API key auto-injected. Supabase calls use the Supabase client directly (not the HTTP adapter).

### Authentication

- **Supabase Auth** with Google OAuth (`signInWithGoogleUseCase`)
- Auth store initializes before app mounts (`main.ts`)
- Router guard: all routes require auth by default; opt out with `meta: { requiresAuth: false }`
- Auth callback handled at `/auth/callback`
- User profiles stored in Supabase `profiles` table, managed via `auth/` use cases

### Routes

| Path | View | Auth Required |
|------|------|:---:|
| `/` | HomeView | Yes |
| `/random` | RandomView | Yes |
| `/episode/:season/:episode` | EpisodeView (Zod-validated params) | Yes |
| `/episodes` | EpisodesView | Yes |
| `/profile` | ProfileView | Yes |
| `/about` | AboutView | Yes |
| `/login` | LoginView | No |
| `/auth/callback` | AuthCallbackView | No |

### Pinia Stores

- **auth** — Supabase user/session/profile state, Google OAuth sign-in/out, profile CRUD
- **episodes** — All episodes, seasons, series details. 24h per-season cache, lazy loading, search with season filtering
- **background** — Dynamic background image toggling from episode stills

### Key Composables

- **useTheme** — Dark/light/system theme, localStorage persistence (`vite-ui-theme` key)
- **useEpisodeCache** — Wraps random episode use-case with loading/error states
- **useDailyEpisode** — Daily episode from Supabase (DB-first, edge function fallback)

### Shared App Components

- `HeroSection` — Page title with v-motion entrance animation
- `EpisodeCard` / `EpisodeCardSkeleton` — Reusable episode card with srcset, v-motion stagger
- `StatCard` — Icon + value + label display
- `SearchFilterBar` — Search input + shadcn Select season filter
- `EmptyState` — Icon + title + description + slot
- `FormField` — Label + slot + error/hint for vee-validate forms

### Notifications

vue-sonner `Toaster` in App.vue; use `toast.success()` / `toast.error()` in views.

### Animations

@vueuse/motion registered as `MotionPlugin` in main.ts. Use `v-motion` directive on elements.
