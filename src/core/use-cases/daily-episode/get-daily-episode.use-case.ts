import { supabase } from "@/config/supabase";
import { DailyEpisodeSchema } from "@/core/schemas/daily-episode.schema";
import type { DailyEpisode } from "@/core/entities/daily-episode.entity";

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Direct Supabase query for today's daily episode.
 * Fast path — no edge function cold start.
 * Returns null if no record exists for today.
 */
export const getDailyEpisodeFromDBUseCase =
  async (): Promise<DailyEpisode | null> => {
    try {
      const { data, error } = await supabase
        .from("daily_episodes")
        .select("*")
        .eq("date", todayUTC())
        .maybeSingle();

      if (error) {
        console.error("[getDailyEpisodeFromDBUseCase] Error:", error.message);
        return null;
      }

      if (!data) return null;

      const parsed = DailyEpisodeSchema.safeParse(data);
      if (!parsed.success) {
        console.error(
          "[getDailyEpisodeFromDBUseCase] Validation error:",
          parsed.error.flatten()
        );
        return data as DailyEpisode;
      }

      return parsed.data;
    } catch (error) {
      console.error("[getDailyEpisodeFromDBUseCase] Error:", error);
      return null;
    }
  };

/**
 * Invokes the daily-episode edge function.
 * Creates the record if it doesn't exist, then returns it.
 */
export const getDailyEpisodeUseCase =
  async (): Promise<DailyEpisode | null> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "daily-episode",
        { method: "POST" }
      );

      if (error) {
        console.error("[getDailyEpisodeUseCase] Error:", error.message);
        throw error;
      }

      const episode = data?.data;
      if (!episode) {
        throw new Error("No episode data in response");
      }

      const parsed = DailyEpisodeSchema.safeParse(episode);
      if (!parsed.success) {
        console.error(
          "[getDailyEpisodeUseCase] Validation error:",
          parsed.error.flatten()
        );
        return episode as DailyEpisode;
      }

      return parsed.data;
    } catch (error) {
      console.error("[getDailyEpisodeUseCase] Error:", error);
      throw error;
    }
  };
