# Requirements Specification - TMDB Integration

## Problem Statement

The current South Park random episode application generates fake episode data using simple random numbers (1-100). Users need access to real South Park episode information from The Movie Database (TMDB) API to get authentic episode titles, descriptions, air dates, and proper season/episode structure.

## Solution Overview

Integrate TMDB API v3 to fetch real South Park episode data, implement caching for performance, and update the random episode selection to work with authentic TMDB episode information using the established use-case pattern.

## Functional Requirements

### RF1: TMDB API Integration
- Modify existing `backend.adapter.ts` to use TMDB API key authentication (`?api_key=` parameter)
- Utilize existing environment variables: `VITE_BACKEND_URL` (TMDB base URL) and `API_KEY` (TMDB API key)
- Support TMDB v3 API endpoints for TV series data

### RF2: Episode Data Fetching
- Fetch South Park series data from TMDB (series ID: 2190)
- Retrieve all episodes across all 27+ seasons
- Cache episode data locally to reduce API calls and improve performance
- Load episode data only when user first clicks "Get Random Episode" button

### RF3: Random Episode Selection
- Select random episodes from complete cached episode list (all seasons)
- Replace current fake random number generation with real TMDB episode selection
- No filtering by season or date (simple random selection)

### RF4: Episode Display
- Update `EpisodeView.vue` to display real TMDB episode data
- Show authentic episode titles, descriptions, air dates, season/episode numbers
- Support new URL structure: `/episode/{season}/{episode}` instead of `/episode/{id}`

### RF5: User Experience
- Maintain existing UI components and user flows
- No user account features or favorites tracking
- No offline functionality required

## Technical Requirements

### TR1: Architecture Patterns
**Location**: Follow existing patterns in `src/core/use-cases/movie-db/`
- Implement use-case pattern for all TMDB operations
- Create dedicated use-cases for episode fetching and random selection
- Follow error handling patterns from existing use-cases

### TR2: Adapter Modifications
**File**: `src/config/adapters/backend.adapter.ts`
- Modify to use TMDB API key authentication instead of Bearer tokens
- Update AxiosAdapter to include `api_key` parameter in requests
- Maintain existing adapter interface and error handling

### TR3: New Components Required

**Entity**: `src/core/entities/episode.entity.ts`
```typescript
interface Episode {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  vote_average?: number;
  runtime?: number;
}
```

**Use Cases**: `src/core/use-cases/movie-db/`
- `get-south-park-episodes.use-case.ts` - Fetch and cache all episodes
- `get-random-episode.use-case.ts` - Select random episode from cache

**Composable**: `src/composables/useEpisodeCache.ts`
- Manage episode cache state
- Handle cache expiration (24-hour TTL)
- Provide loading states

### TR4: TMDB API Implementation
**Base URL**: Use existing `VITE_BACKEND_URL`
**Authentication**: Use existing `API_KEY` environment variable

**Key Endpoints**:
- `GET /tv/2190` - South Park series details
- `GET /tv/2190?append_to_response=season/1,season/2,...` - All seasons data
- `GET /tv/2190/season/{season_number}` - Individual season (fallback)

### TR5: Routing Updates
**File**: `src/router/index.ts`
- Update episode route from `/episode/:id` to `/episode/:season/:episode`
- Update all RouterLink references in components

**File**: `src/views/EpisodeView.vue`
- Update to accept season and episode parameters
- Fetch episode details using TMDB API
- Display real episode metadata

### TR6: View Updates
**File**: `src/views/HomeView.vue`
- Replace `Math.floor(Math.random() * 100) + 1` with use-case call
- Update RouterLink to use season/episode format
- Add loading state during episode cache fetch

## Implementation Hints

### Caching Strategy
```typescript
// Use reactive cache in composable
const episodeCache = ref<Episode[]>([]);
const lastFetchTime = ref<Date | null>(null);
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
```

### TMDB API Optimization
- Use `append_to_response` to fetch multiple seasons in single request
- Implement retry logic for rate limiting
- Handle partial failures gracefully

### Error Handling
- Fallback to current fake data generation if TMDB API fails
- Show user-friendly error messages
- Maintain loading states throughout

## Acceptance Criteria

### AC1: Real Episode Data
- [ ] Random episode button returns actual South Park episodes
- [ ] Episode titles, descriptions, and air dates are authentic
- [ ] All 27+ seasons are included in random selection

### AC2: Performance
- [ ] Episode data is cached after first fetch
- [ ] Subsequent random selections are instant (no API calls)
- [ ] Cache expires and refreshes after 24 hours

### AC3: URL Structure
- [ ] Episode URLs use format `/episode/{season}/{episode}`
- [ ] Direct navigation to episode URLs works correctly
- [ ] Random episode redirects to proper season/episode URL

### AC4: UI/UX
- [ ] Loading states shown during initial episode cache fetch
- [ ] Error handling graceful with fallback to current behavior
- [ ] No breaking changes to existing UI components

### AC5: Code Quality
- [ ] Follows existing use-case pattern
- [ ] Proper TypeScript interfaces and error handling
- [ ] Consistent with existing adapter and composable patterns

## Assumptions

1. **Environment Configuration**: `VITE_BACKEND_URL` points to `https://api.themoviedb.org/3/` and `API_KEY` contains valid TMDB API key
2. **API Stability**: TMDB API v3 endpoints remain stable and South Park data structure doesn't change frequently
3. **Rate Limits**: TMDB API rate limits are sufficient for application usage patterns
4. **Browser Support**: Local storage and modern JavaScript features are available for caching
5. **Data Completeness**: South Park episodes on TMDB are complete and accurate for all seasons