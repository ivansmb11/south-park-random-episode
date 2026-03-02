import { backendFetcher } from "../../../config/adapters/backend.adapter";
import { SeasonSchema, TVSeriesSchema } from "../../schemas/episode.schema";
import type { Episode, Season, TVSeries } from "../../entities/episode.entity";

const SOUTH_PARK_SERIES_ID = 2190;

export interface PaginatedEpisodesResponse {
  episodes: Episode[];
  hasMore: boolean;
  totalEpisodes: number;
  totalSeasons: number;
  loadedSeasons: number[];
}

// Cache for series details and loaded seasons
let seriesDetailsCache: TVSeries | null = null;
let loadedSeasonsCache: Map<number, Season> = new Map();

// Get South Park TV series details (cached)
const getCachedSeriesDetails = async (): Promise<TVSeries> => {
  if (seriesDetailsCache) {
    return seriesDetailsCache;
  }

  try {
    const response = await backendFetcher.get<unknown>(`tv/${SOUTH_PARK_SERIES_ID}`);
    const parsed = TVSeriesSchema.safeParse(response);
    if (!parsed.success) {
      console.error("[getCachedSeriesDetails] Validation error:", parsed.error.flatten());
      throw new Error("Invalid series data received from TMDB");
    }
    seriesDetailsCache = parsed.data;
    return parsed.data;
  } catch (error) {
    console.error("Error getting South Park series details:", error);
    throw new Error("Failed to fetch South Park series details");
  }
};

// Get specific season details with episodes (cached)
const getCachedSeason = async (seasonNumber: number): Promise<Season> => {
  if (loadedSeasonsCache.has(seasonNumber)) {
    return loadedSeasonsCache.get(seasonNumber)!;
  }

  try {
    const response = await backendFetcher.get<unknown>(
      `tv/${SOUTH_PARK_SERIES_ID}/season/${seasonNumber}`
    );
    const parsed = SeasonSchema.safeParse(response);
    if (!parsed.success) {
      console.error(`[getCachedSeason] Validation error for season ${seasonNumber}:`, parsed.error.flatten());
      throw new Error(`Invalid season data for season ${seasonNumber}`);
    }
    loadedSeasonsCache.set(seasonNumber, parsed.data);
    return parsed.data;
  } catch (error) {
    console.error(`Error getting South Park season ${seasonNumber}:`, error);
    throw new Error(`Failed to fetch South Park season ${seasonNumber}`);
  }
};

// Get episodes with pagination (by seasons)
export const getPaginatedSouthParkEpisodes = async (
  seasonsPerPage: number = 3,
  currentPage: number = 1
): Promise<PaginatedEpisodesResponse> => {
  try {
    const seriesDetails = await getCachedSeriesDetails();
    const totalSeasons = seriesDetails.number_of_seasons;

    // Calculate which seasons to load for this page
    const startSeason = (currentPage - 1) * seasonsPerPage + 1;
    const endSeason = Math.min(startSeason + seasonsPerPage - 1, totalSeasons);

    const episodes: Episode[] = [];
    const loadedSeasons: number[] = [];

    // Load episodes from the specified seasons
    for (let seasonNum = startSeason; seasonNum <= endSeason; seasonNum++) {
      try {
        const season = await getCachedSeason(seasonNum);
        if (season.episodes && season.episodes.length > 0) {
          episodes.push(...season.episodes);
          loadedSeasons.push(seasonNum);
        }
      } catch (error) {
        console.warn(`Skipping season ${seasonNum} due to error:`, error);
      }

      // Add small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Sort episodes by season and episode number
    episodes.sort((a, b) => {
      if (a.season_number !== b.season_number) {
        return a.season_number - b.season_number;
      }
      return a.episode_number - b.episode_number;
    });

    const hasMore = endSeason < totalSeasons;

    return {
      episodes,
      hasMore,
      totalEpisodes: seriesDetails.number_of_episodes,
      totalSeasons,
      loadedSeasons
    };
  } catch (error) {
    console.error("Error getting paginated South Park episodes:", error);
    throw new Error("Failed to fetch paginated South Park episodes");
  }
};

// Load next batch of episodes (incremental loading)
export const loadNextEpisodeBatch = async (
  loadedSeasons: number[],
  seasonsPerBatch: number = 2
): Promise<PaginatedEpisodesResponse> => {
  try {
    const seriesDetails = await getCachedSeriesDetails();
    const totalSeasons = seriesDetails.number_of_seasons;

    // Find the next seasons to load
    const maxLoadedSeason = Math.max(...loadedSeasons, 0);
    const startSeason = maxLoadedSeason + 1;
    const endSeason = Math.min(startSeason + seasonsPerBatch - 1, totalSeasons);

    const newEpisodes: Episode[] = [];
    const newLoadedSeasons: number[] = [];

    // Load episodes from the next batch of seasons
    for (let seasonNum = startSeason; seasonNum <= endSeason; seasonNum++) {
      try {
        const season = await getCachedSeason(seasonNum);
        if (season.episodes && season.episodes.length > 0) {
          newEpisodes.push(...season.episodes);
          newLoadedSeasons.push(seasonNum);
        }
      } catch (error) {
        console.warn(`Skipping season ${seasonNum} due to error:`, error);
      }

      // Add small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Sort new episodes
    newEpisodes.sort((a, b) => {
      if (a.season_number !== b.season_number) {
        return a.season_number - b.season_number;
      }
      return a.episode_number - b.episode_number;
    });

    const hasMore = endSeason < totalSeasons;
    const allLoadedSeasons = [...loadedSeasons, ...newLoadedSeasons];

    return {
      episodes: newEpisodes,
      hasMore,
      totalEpisodes: seriesDetails.number_of_episodes,
      totalSeasons,
      loadedSeasons: allLoadedSeasons
    };
  } catch (error) {
    console.error("Error loading next episode batch:", error);
    throw new Error("Failed to load next episode batch");
  }
};

// Get all available seasons for filters
export const getAvailableSeasons = async (): Promise<Season[]> => {
  try {
    const seriesDetails = await getCachedSeriesDetails();
    return seriesDetails.seasons.filter(season => season.season_number > 0);
  } catch (error) {
    console.error("Error getting available seasons:", error);
    throw new Error("Failed to fetch available seasons");
  }
};

// Clear cache (useful for testing or manual refresh)
export const clearEpisodeCache = (): void => {
  seriesDetailsCache = null;
  loadedSeasonsCache.clear();
};

// Get cache status information
export const getCacheStatus = () => {
  return {
    hasSeriesDetails: seriesDetailsCache !== null,
    loadedSeasonsCount: loadedSeasonsCache.size,
    loadedSeasons: Array.from(loadedSeasonsCache.keys()).sort((a, b) => a - b)
  };
};
