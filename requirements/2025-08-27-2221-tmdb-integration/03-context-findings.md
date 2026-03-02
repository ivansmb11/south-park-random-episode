# Context Findings - TMDB Integration

## Existing Architecture Analysis

### Current Adapter Pattern
- **Location**: `src/config/adapters/`
- **Structure**: 
  - Abstract `HttpAdapter` class defining contract
  - `AxiosAdapter` implementation with auth token handling
  - `backend.adapter.ts` configured for `VITE_BACKEND_URL`
- **Pattern**: Uses dependency injection and adapter pattern consistently

### Current Use-Case Pattern
- **Location**: `src/core/use-cases/movie-db/`
- **Existing**: 
  - `get-accout-details.use-case.ts` (with typo in filename)
  - `authenticate-api.use-case.ts` (referenced in index but file missing)
- **Pattern**: Simple async functions with error handling
- **Dependencies**: Uses `backendFetcher` from adapter

### Current Random Episode Implementation
- **Location**: `src/views/HomeView.vue` line 12-15
- **Current Logic**: Simple `Math.floor(Math.random() * 100) + 1`
- **Issue**: Generates fake episode IDs (1-100), not real TMDB data

### Environment Configuration
- **VITE_BACKEND_URL**: Already configured for TMDB API base URL
- **API_KEY**: Available as TMDB API key
- **Authentication**: Current axios adapter handles Bearer token auth

## TMDB API Requirements Analysis

### Key Endpoints Needed
1. **TV Series Details**: `GET /tv/{series_id}` (South Park ID: 2190)
2. **Season Details**: `GET /tv/{series_id}/season/{season_number}`
3. **Episode Details**: `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}`

### Authentication Method
- TMDB uses API key in query parameter: `?api_key={api_key}`
- Current adapter uses Bearer token - needs modification

### Data Structure for Random Selection
- Need to fetch all seasons for series 2190
- Each season contains episodes array
- Build flat list of all episodes for random selection
- Cache structure: `{ seasonNumber, episodeNumber, title, overview, air_date }`

## Implementation Strategy

### Files to Modify/Create
1. **New TMDB Adapter**: `src/config/adapters/tmdb.adapter.ts`
2. **Episode Entity**: `src/core/entities/episode.entity.ts`
3. **Use Cases**:
   - `src/core/use-cases/movie-db/get-south-park-episodes.use-case.ts`
   - `src/core/use-cases/movie-db/get-random-episode.use-case.ts`
4. **Update**: `src/views/HomeView.vue` to use new use-cases

### Caching Strategy
- Use reactive ref for episode cache
- Store in composable: `src/composables/useEpisodeCache.ts`
- Cache key: `south-park-episodes`
- TTL: 24 hours (episodes don't change frequently)

### Error Handling Patterns
- Follow existing pattern: try/catch with console.error
- Graceful fallback to current fake random when API fails
- Loading states during initial fetch

## Technical Constraints

### API Rate Limits
- TMDB allows 40 requests per 10 seconds for API key auth
- Need to batch season requests with delay or use append_to_response
- Recommend append_to_response for efficiency

### Data Volume
- South Park has 27+ seasons with ~300+ episodes
- Single API call with append_to_response preferred
- Fallback: Sequential season requests with rate limiting

## Integration Points

### Current Router Structure
- Random episode redirects to `/episode/${episodeId}`
- Need to change ID structure to include season: `/episode/{season}/{episode}`
- Or keep simple ID and map internally

### UI Components
- HomeView already has random button and result card
- EpisodeView expects episode ID parameter
- Need to pass real TMDB episode data instead of fake data