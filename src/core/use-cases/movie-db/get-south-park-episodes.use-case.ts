import { backendFetcher } from "../../../config/adapters/backend.adapter";
import { EpisodeSchema, SeasonSchema, TVSeriesSchema } from "../../schemas/episode.schema";
import type { Episode, Season, TVSeries } from "../../entities/episode.entity";

const SOUTH_PARK_SERIES_ID = 2190;

// Get South Park TV series details with all seasons
export const getSouthParkSeriesDetails = async (): Promise<TVSeries> => {
  try {
    const response = await backendFetcher.get<unknown>(`tv/${SOUTH_PARK_SERIES_ID}`);
    const parsed = TVSeriesSchema.safeParse(response);
    if (!parsed.success) {
      console.error("[getSouthParkSeriesDetails] Validation error:", parsed.error.flatten());
      throw new Error("Invalid series data received from TMDB");
    }
    return parsed.data;
  } catch (error) {
    console.error("Error getting South Park series details:", error);
    throw new Error("Failed to fetch South Park series details");
  }
};

// Get specific season details with episodes
export const getSouthParkSeason = async (seasonNumber: number): Promise<Season> => {
  try {
    const response = await backendFetcher.get<unknown>(
      `tv/${SOUTH_PARK_SERIES_ID}/season/${seasonNumber}`
    );
    const parsed = SeasonSchema.safeParse(response);
    if (!parsed.success) {
      console.error(`[getSouthParkSeason] Validation error for season ${seasonNumber}:`, parsed.error.flatten());
      throw new Error(`Invalid season data received for season ${seasonNumber}`);
    }
    return parsed.data;
  } catch (error) {
    console.error(`Error getting South Park season ${seasonNumber}:`, error);
    throw new Error(`Failed to fetch South Park season ${seasonNumber}`);
  }
};

// Get all episodes from all seasons of South Park
export const getAllSouthParkEpisodes = async (): Promise<Episode[]> => {
  try {
    // First get series details to know how many seasons exist
    const seriesDetails = await getSouthParkSeriesDetails();
    const allEpisodes: Episode[] = [];

    // Get episodes from each season
    for (let seasonNum = 1; seasonNum <= seriesDetails.number_of_seasons; seasonNum++) {
      try {
        const season = await getSouthParkSeason(seasonNum);
        if (season.episodes && season.episodes.length > 0) {
          allEpisodes.push(...season.episodes);
        }
      } catch (error) {
        console.warn(`Skipping season ${seasonNum} due to error:`, error);
        // Continue with other seasons even if one fails
      }

      // Add small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allEpisodes;
  } catch (error) {
    console.error("Error getting all South Park episodes:", error);
    throw new Error("Failed to fetch all South Park episodes");
  }
};

// Get specific episode details
export const getSouthParkEpisode = async (
  seasonNumber: number,
  episodeNumber: number
): Promise<Episode> => {
  try {
    const response = await backendFetcher.get<unknown>(
      `tv/${SOUTH_PARK_SERIES_ID}/season/${seasonNumber}/episode/${episodeNumber}`
    );
    const parsed = EpisodeSchema.safeParse(response);
    if (!parsed.success) {
      console.error(`[getSouthParkEpisode] Validation error for S${seasonNumber}E${episodeNumber}:`, parsed.error.flatten());
      throw new Error(`Invalid episode data for S${seasonNumber}E${episodeNumber}`);
    }
    return parsed.data;
  } catch (error) {
    console.error(`Error getting South Park episode S${seasonNumber}E${episodeNumber}:`, error);
    throw new Error(`Failed to fetch South Park episode S${seasonNumber}E${episodeNumber}`);
  }
};
