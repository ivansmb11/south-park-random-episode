# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Vue 3 + TypeScript + Vite web app for discovering random South Park episodes. Uses the TMDB (The Movie Database) API to fetch episode data. South Park series ID on TMDB: **2190**.

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

## Architecture

**Stack:** Vue 3 Composition API (`<script setup>`), Pinia, Vue Router, Axios, Tailwind CSS 4, shadcn-vue (reka-ui based)

**Path alias:** `@/*` → `src/*`

### Layers

```
src/
├── core/                    # Domain layer
│   ├── entities/            # TypeScript interfaces (Episode, Season, TVSeries, TMDBResponse)
│   └── use-cases/movie-db/  # Business logic (TMDB API calls)
├── config/
│   ├── adapters/            # HTTP adapter pattern (abstract HttpAdapter → AxiosAdapter)
│   └── assets.bucket.ts     # Google Cloud Storage URLs for static character images
├── stores/                  # Pinia stores
├── composables/             # Vue composables (useTheme, useEpisodeCache)
├── views/                   # Route-level page components
├── components/              # App components + ui/ (shadcn-vue primitives)
├── lib/                     # Utilities (TMDB image URLs, Tailwind cn() helper)
└── router/                  # Vue Router config
```

### HTTP Adapter Pattern

`HttpAdapter` (abstract class in `config/adapters/http/http.adapter.ts`) defines get/post/put/delete/patch methods. `AxiosAdapter` implements it. A single instance `backendFetcher` is created in `config/adapters/backend.adapter.ts` pointing at TMDB with the API key injected as a query param.

### Use Cases

All in `src/core/use-cases/movie-db/`:

- **get-south-park-episodes** — Core API calls: series details, season data, specific episode, all episodes
- **get-random-episode** — Random selection with in-memory cache (24h TTL). Falls back to a fake episode if API fails
- **get-paginated-episodes** — Batch/incremental season loading for the browse page
- **get-account-details** — TMDB account info (unused in views currently)

### Pinia Stores

- **episodes** (`stores/episodes.ts`) — Main store. Holds all episodes, seasons, series details. Features 24h per-season cache, lazy loading (initial 3 seasons), incremental loading, search with season filtering, loading progress tracking
- **background** (`stores/background.ts`) — Manages dynamic background image state (toggling, setting from episode stills)

### Routes

Defined in `src/router/index.ts` with lazy-loaded views:

| Path | View | Description |
|------|------|-------------|
| `/` | HomeView | Random episode generator |
| `/random` | HomeView | Alias for home |
| `/episode/:season/:episode` | EpisodeView | Episode detail (params parsed as integers) |
| `/episodes` | EpisodesView | Browse all with search, filter, infinite scroll |
| `/about` | AboutView | About page |

### Key Views

- **HomeView** — "Get Random Episode" button, shows episode card, updates background image
- **EpisodeView** — Full episode details (image, title, air date, rating, runtime, overview). Route props: `season: number`, `episode: number`
- **EpisodesView** — Search by title/overview, filter by season, infinite scroll loading 2 seasons at a time, responsive grid

### Composables

- **useTheme** — Dark/light/system theme with localStorage persistence (`vite-ui-theme` key), system preference listener
- **useEpisodeCache** — Wraps random episode use-case, exposes loading/error states and cache info

### TMDB Image Utilities

`src/lib/tmdb-images.ts` builds image URLs from TMDB paths. Supports poster sizes (w92–original), backdrop sizes (w300–original), and srcset generation for responsive images.

### UI Components

`src/components/ui/` contains shadcn-vue components (button, card, sidebar, sheet, dropdown-menu, collapsible, avatar, breadcrumb, input, separator, skeleton, tooltip). These use reka-ui primitives underneath and class-variance-authority for variants.

### Layout

`LayoutComponent.vue` provides the app shell: sidebar navigation (via shadcn sidebar provider), dynamic background image support, header with breadcrumb and theme toggle.
