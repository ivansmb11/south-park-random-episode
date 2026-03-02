# Discovery Answers - TMDB Integration

## Q1: Should the TMDB integration use a different API key/configuration than the existing backend adapter?
**Answer:** Yes, create a separate adapter, but .env has already VITE_BACKEND_URL as TMDB url, and API_KEY is the TMDB api key

## Q2: Should random episode selection work across all 27 seasons of South Park?
**Answer:** Yes, all seasons

## Q3: Should the random episode feature cache episode data locally to reduce API calls?
**Answer:** Yes

## Q4: Should users be able to filter random episodes by specific seasons or date ranges?
**Answer:** No

## Q5: Should the app store user's viewing history or favorites when integrated with TMDB?
**Answer:** No