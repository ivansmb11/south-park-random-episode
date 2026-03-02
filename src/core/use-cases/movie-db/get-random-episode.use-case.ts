import { EpisodeSchema } from "../../schemas/episode.schema";
import type { Episode } from "../../entities/episode.entity";
import { getAllSouthParkEpisodes } from "./get-south-park-episodes.use-case";

// Cache for episodes to avoid repeated API calls
let episodeCache: Episode[] | null = null;
let lastCacheTime: Date | null = null;

// Cache TTL: 24 hours
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Check if cache is valid
const isCacheValid = (): boolean => {
  if (!episodeCache || !lastCacheTime) {
    return false;
  }

  const now = new Date();
  return (now.getTime() - lastCacheTime.getTime()) < CACHE_TTL_MS;
};

// Get cached episodes or fetch fresh ones
const getCachedEpisodes = async (): Promise<Episode[]> => {
  if (isCacheValid() && episodeCache) {
    return episodeCache;
  }

  // Cache is invalid or empty, fetch fresh data
  try {
    episodeCache = await getAllSouthParkEpisodes();
    lastCacheTime = new Date();
    return episodeCache;
  } catch (error) {
    console.error("Error fetching episodes for cache:", error);

    // Return cached data even if expired, or empty array as fallback
    if (episodeCache && episodeCache.length > 0) {
      console.warn("Using expired cache due to API error");
      return episodeCache;
    }

    throw error;
  }
};

// Fallback episode that passes schema validation
const createFallbackEpisode = (): Episode => {
  const fallback = {
    id: Math.floor(Math.random() * 1000),
    season_number: Math.floor(Math.random() * 27) + 1,
    episode_number: Math.floor(Math.random() * 20) + 1,
    name: `South Park Episode #${Math.floor(Math.random() * 100) + 1}`,
    overview: "This is a fallback episode description. In this episode, the boys find themselves in another hilarious adventure in South Park, Colorado.",
    air_date: "1997-08-13",
    vote_average: 8.0,
  };

  const parsed = EpisodeSchema.safeParse(fallback);
  if (!parsed.success) {
    console.error("[createFallbackEpisode] Validation error:", parsed.error.flatten());
  }
  return parsed.success ? parsed.data : (fallback as Episode);
};

// Get a random South Park episode
export const getRandomSouthParkEpisode = async (): Promise<Episode> => {
  try {
    const episodes = await getCachedEpisodes();

    if (episodes.length === 0) {
      throw new Error("No episodes available");
    }

    // Generate random index
    const randomIndex = Math.floor(Math.random() * episodes.length);

    return episodes[randomIndex];
  } catch (error) {
    console.error("Error getting random South Park episode:", error);
    console.warn("Using fallback episode due to API error");
    return createFallbackEpisode();
  }
};

// Clear the episode cache (useful for testing or manual refresh)
export const clearEpisodeCache = (): void => {
  episodeCache = null;
  lastCacheTime = null;
};

// Get cache status information
export const getCacheStatus = () => {
  return {
    isCached: episodeCache !== null,
    episodeCount: episodeCache?.length || 0,
    lastCacheTime,
    isValid: isCacheValid()
  };
};
