import { ref, computed } from 'vue';
import type { Episode } from '@/core/entities/episode.entity';
import { 
  getRandomSouthParkEpisode, 
  clearEpisodeCache, 
  getCacheStatus 
} from '@/core/use-cases/movie-db/get-random-episode.use-case';
import { getSouthParkEpisode } from '@/core/use-cases/movie-db/get-south-park-episodes.use-case';

// Global state for the composable
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useEpisodeCache() {
  const loading = computed(() => isLoading.value);
  const hasError = computed(() => error.value !== null);

  // Get a random episode
  const getRandomEpisode = async (): Promise<Episode | null> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const episode = await getRandomSouthParkEpisode();
      return episode;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get random episode';
      console.error('Error in getRandomEpisode:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Get specific episode by season and episode number
  const getEpisode = async (season: number, episode: number): Promise<Episode | null> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const episodeData = await getSouthParkEpisode(season, episode);
      return episodeData;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get episode';
      console.error(`Error in getEpisode S${season}E${episode}:`, err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Clear the cache manually
  const clearCache = () => {
    clearEpisodeCache();
  };

  // Get cache information
  const cacheInfo = computed(() => getCacheStatus());

  // Clear any existing error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    loading,
    hasError,
    error: computed(() => error.value),
    cacheInfo,
    
    // Methods
    getRandomEpisode,
    getEpisode,
    clearCache,
    clearError,
  };
}