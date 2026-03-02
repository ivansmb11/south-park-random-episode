# Discovery Questions - TMDB Integration

## Q1: Should the TMDB integration use a different API key/configuration than the existing backend adapter?
**Default if unknown:** Yes (TMDB API requires its own API key and base URL, separate from the current backend configuration)

## Q2: Should random episode selection work across all 27 seasons of South Park?
**Default if unknown:** Yes (users would want access to the full catalog for truly random selection)

## Q3: Should the random episode feature cache episode data locally to reduce API calls?
**Default if unknown:** Yes (improves performance and reduces API quota usage)

## Q4: Should users be able to filter random episodes by specific seasons or date ranges?
**Default if unknown:** No (keep the random feature simple initially)

## Q5: Should the app store user's viewing history or favorites when integrated with TMDB?
**Default if unknown:** No (focus on core random episode functionality first)