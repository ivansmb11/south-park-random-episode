import { ref, computed } from "vue";
import type { DailyEpisode } from "@/core/entities/daily-episode.entity";
import {
  getDailyEpisodeFromDBUseCase,
  getDailyEpisodeUseCase,
} from "@/core/use-cases/daily-episode/get-daily-episode.use-case";

// Module-level state (shared across all component instances)
const dailyEpisodeRef = ref<DailyEpisode | null>(null);
const isLoading = ref(false);
const errorRef = ref<string | null>(null);
let lastFetchDate: string | null = null;

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyEpisode() {
  const dailyEpisode = computed(() => dailyEpisodeRef.value);
  const loading = computed(() => isLoading.value);
  const hasError = computed(() => errorRef.value !== null);
  const error = computed(() => errorRef.value);

  const fetchDailyEpisode = async (): Promise<DailyEpisode | null> => {
    const today = todayUTC();

    // Skip if already fetched today
    if (lastFetchDate === today && dailyEpisodeRef.value) {
      return dailyEpisodeRef.value;
    }

    isLoading.value = true;
    errorRef.value = null;

    try {
      // Phase 1: Try direct DB query (fast, no cold start)
      let episode = await getDailyEpisodeFromDBUseCase();

      // Phase 2: If not in DB, invoke edge function to create it
      if (!episode) {
        episode = await getDailyEpisodeUseCase();
      }

      if (episode) {
        dailyEpisodeRef.value = episode;
        lastFetchDate = today;
      }

      return episode;
    } catch (err) {
      errorRef.value =
        err instanceof Error ? err.message : "Failed to get daily episode";
      console.error("Error in fetchDailyEpisode:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    errorRef.value = null;
  };

  return {
    dailyEpisode,
    loading,
    hasError,
    error,
    fetchDailyEpisode,
    clearError,
  };
}
