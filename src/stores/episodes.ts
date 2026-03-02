import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Episode, Season, TVSeries } from '@/core/entities/episode.entity'
import { 
  getSouthParkSeason, 
  getSouthParkSeriesDetails 
} from '@/core/use-cases/movie-db/get-south-park-episodes.use-case'

export interface SeasonCache {
  episodes: Episode[]
  isComplete: boolean // Whether all episodes for this season are fetched
  lastFetched: Date
  episodeCount: number // Expected number of episodes in this season
}

export const useEpisodesStore = defineStore('episodes', () => {
  // State
  const allEpisodes = ref<Episode[]>([])
  const seasons = ref<Season[]>([])
  const seriesDetails = ref<TVSeries | null>(null)
  const seasonCache = ref<Map<number, SeasonCache>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Cache TTL: 24 hours
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000

  // Getters
  const getEpisodesBySeasons = computed(() => {
    return (seasonNumbers: number[]) => {
      return allEpisodes.value.filter(episode => 
        seasonNumbers.includes(episode.season_number)
      ).sort((a, b) => {
        if (a.season_number !== b.season_number) {
          return a.season_number - b.season_number
        }
        return a.episode_number - b.episode_number
      })
    }
  })

  const isSeasonComplete = computed(() => {
    return (seasonNumber: number) => {
      const cache = seasonCache.value.get(seasonNumber)
      return cache?.isComplete || false
    }
  })

  const isSeasonCacheValid = computed(() => {
    return (seasonNumber: number) => {
      const cache = seasonCache.value.get(seasonNumber)
      if (!cache) return false
      
      const now = new Date()
      return (now.getTime() - cache.lastFetched.getTime()) < CACHE_TTL_MS
    }
  })

  const getLoadedSeasons = computed(() => {
    return Array.from(seasonCache.value.keys()).sort((a, b) => a - b)
  })

  const getTotalEpisodesCount = computed(() => {
    return seriesDetails.value?.number_of_episodes || 0
  })

  const getTotalSeasonsCount = computed(() => {
    return seriesDetails.value?.number_of_seasons || 0
  })

  const getLoadingProgress = computed(() => {
    if (!seriesDetails.value) return 0
    const loadedCount = seasonCache.value.size
    const totalCount = seriesDetails.value.number_of_seasons
    return Math.round((loadedCount / totalCount) * 100)
  })

  // Actions
  const initializeStore = async () => {
    if (loading.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // Load series details if not already loaded
      if (!seriesDetails.value) {
        seriesDetails.value = await getSouthParkSeriesDetails()
        seasons.value = seriesDetails.value.seasons.filter(season => season.season_number > 0)
      }
      
      // Load first 3 seasons by default
      await loadSeasons([1, 2, 3])
      
    } catch (err) {
      console.error('Error initializing episodes store:', err)
      error.value = 'Failed to initialize episodes data'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadSeason = async (seasonNumber: number, force = false): Promise<void> => {
    // Check if season is already cached and valid
    if (!force && isSeasonCacheValid.value(seasonNumber)) {
      return
    }

    try {
      const seasonData = await getSouthParkSeason(seasonNumber)
      
      if (seasonData.episodes && seasonData.episodes.length > 0) {
        // Remove existing episodes for this season
        allEpisodes.value = allEpisodes.value.filter(
          ep => ep.season_number !== seasonNumber
        )
        
        // Add new episodes
        allEpisodes.value.push(...seasonData.episodes)
        
        // Update cache
        seasonCache.value.set(seasonNumber, {
          episodes: [...seasonData.episodes],
          isComplete: true,
          lastFetched: new Date(),
          episodeCount: seasonData.episodes.length
        })
      }
    } catch (err) {
      console.error(`Error loading season ${seasonNumber}:`, err)
      throw new Error(`Failed to load season ${seasonNumber}`)
    }
  }

  const loadSeasons = async (seasonNumbers: number[]): Promise<void> => {
    const seasonsToLoad = seasonNumbers.filter(
      seasonNum => !isSeasonCacheValid.value(seasonNum)
    )

    if (seasonsToLoad.length === 0) return

    const loadPromises = seasonsToLoad.map(seasonNum => 
      loadSeason(seasonNum).catch(err => {
        console.warn(`Skipping season ${seasonNum} due to error:`, err)
      })
    )

    await Promise.all(loadPromises)
  }

  const loadMoreSeasons = async (count = 2): Promise<void> => {
    if (!seriesDetails.value) await initializeStore()
    
    const loadedSeasonNumbers = getLoadedSeasons.value
    const maxLoadedSeason = loadedSeasonNumbers.length > 0 
      ? Math.max(...loadedSeasonNumbers) 
      : 0
    
    const totalSeasons = seriesDetails.value?.number_of_seasons || 0
    const startSeason = maxLoadedSeason + 1
    const endSeason = Math.min(startSeason + count - 1, totalSeasons)
    
    if (startSeason > totalSeasons) return
    
    const seasonsToLoad = []
    for (let i = startSeason; i <= endSeason; i++) {
      seasonsToLoad.push(i)
    }
    
    await loadSeasons(seasonsToLoad)
  }

  const ensureSeasonLoaded = async (seasonNumber: number): Promise<void> => {
    if (!isSeasonComplete.value(seasonNumber)) {
      await loadSeason(seasonNumber)
    }
  }

  const searchEpisodes = (searchTerm: string, seasonFilter?: number): Episode[] => {
    let filtered = allEpisodes.value

    // Filter by season first
    if (seasonFilter) {
      filtered = filtered.filter(episode => episode.season_number === seasonFilter)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(episode =>
        episode.name.toLowerCase().includes(search) ||
        episode.overview?.toLowerCase().includes(search)
      )
    }

    return filtered.sort((a, b) => {
      if (a.season_number !== b.season_number) {
        return a.season_number - b.season_number
      }
      return a.episode_number - b.episode_number
    })
  }

  const clearCache = () => {
    allEpisodes.value = []
    seasonCache.value.clear()
    seriesDetails.value = null
    seasons.value = []
    error.value = null
  }

  const getCacheStatus = () => {
    return {
      totalEpisodes: allEpisodes.value.length,
      cachedSeasons: seasonCache.value.size,
      loadedSeasons: getLoadedSeasons.value,
      hasSeriesDetails: !!seriesDetails.value,
      cacheEntries: Array.from(seasonCache.value.entries()).map(([season, cache]) => ({
        season,
        episodeCount: cache.episodes.length,
        isComplete: cache.isComplete,
        lastFetched: cache.lastFetched
      }))
    }
  }

  const hasMoreSeasonsToLoad = computed(() => {
    if (!seriesDetails.value) return true
    return seasonCache.value.size < seriesDetails.value.number_of_seasons
  })

  return {
    // State
    allEpisodes,
    seasons,
    seriesDetails,
    loading,
    error,
    
    // Getters
    getEpisodesBySeasons,
    isSeasonComplete,
    isSeasonCacheValid,
    getLoadedSeasons,
    getTotalEpisodesCount,
    getTotalSeasonsCount,
    getLoadingProgress,
    hasMoreSeasonsToLoad,
    
    // Actions
    initializeStore,
    loadSeason,
    loadSeasons,
    loadMoreSeasons,
    ensureSeasonLoaded,
    searchEpisodes,
    clearCache,
    getCacheStatus
  }
})