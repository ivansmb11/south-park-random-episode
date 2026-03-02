# Expert Detail Answers - TMDB Integration

## Q6: Should we modify the existing backend.adapter.ts to use TMDB's API key authentication instead of Bearer tokens?
**Answer:** Yes

## Q7: Should episode URLs use the current simple ID format `/episode/{id}` or change to season/episode format `/episode/{season}/{episode}`?
**Answer:** The one that is better for using TMDB (season/episode format)

## Q8: Should the initial episode cache loading happen on app startup or when the user first clicks "Get Random Episode"?
**Answer:** When user clicks button

## Q9: Should we extend the existing EpisodeView.vue to display real TMDB episode data or keep the current simulated episode information?
**Answer:** Yes, use real TMDB data

## Q10: Should we create a separate TMDB adapter or modify the existing backend adapter to handle TMDB's authentication pattern?
**Answer:** Modify existing adapter