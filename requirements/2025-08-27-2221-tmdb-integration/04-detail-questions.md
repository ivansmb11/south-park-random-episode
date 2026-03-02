# Expert Detail Questions - TMDB Integration

## Q6: Should we modify the existing backend.adapter.ts to use TMDB's API key authentication instead of Bearer tokens?
**Default if unknown:** Yes (TMDB uses `?api_key=` parameter, not Authorization headers, and the existing adapter is already configured for TMDB base URL)

## Q7: Should episode URLs use the current simple ID format `/episode/{id}` or change to season/episode format `/episode/{season}/{episode}`?
**Default if unknown:** Keep current format (maintain URL compatibility and use internal mapping from simple ID to season/episode)

## Q8: Should the initial episode cache loading happen on app startup or when the user first clicks "Get Random Episode"?
**Default if unknown:** When user clicks button (avoids unnecessary API call if user doesn't use random feature)

## Q9: Should we extend the existing EpisodeView.vue to display real TMDB episode data or keep the current simulated episode information?
**Default if unknown:** Yes, use real TMDB data (provides actual episode titles, descriptions, air dates, and other metadata)

## Q10: Should we create a separate TMDB adapter or modify the existing backend adapter to handle TMDB's authentication pattern?
**Default if unknown:** Modify existing adapter (the VITE_BACKEND_URL is already set to TMDB and we want to reuse the established pattern)