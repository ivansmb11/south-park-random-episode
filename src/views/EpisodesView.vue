<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import Button from '@/components/ui/button.vue'
import Skeleton from '@/components/ui/skeleton.vue'
import { Film, Search, Play, RotateCcw, Loader2 } from 'lucide-vue-next'
import { useEpisodesStore } from '@/stores/episodes'
import HeroSection from '@/components/HeroSection.vue'
import EpisodeCard from '@/components/EpisodeCard.vue'
import EpisodeCardSkeleton from '@/components/EpisodeCardSkeleton.vue'
import SearchFilterBar from '@/components/SearchFilterBar.vue'
import EmptyState from '@/components/EmptyState.vue'

// Store
const episodesStore = useEpisodesStore()

// Local reactive state
const searchTerm = ref('')
const selectedSeason = ref('all')
const loadingMore = ref(false)

// Infinite scroll observer
let observer: IntersectionObserver | null = null
const loadMoreTrigger = ref<HTMLElement | null>(null)

// Computed properties
const selectedSeasonNumber = computed(() => {
  return selectedSeason.value === 'all' ? null : Number(selectedSeason.value)
})

const filteredEpisodes = computed(() => {
  return episodesStore.searchEpisodes(searchTerm.value, selectedSeasonNumber.value || undefined)
})

const hasActiveFilters = computed(() => {
  return searchTerm.value.trim() !== '' || selectedSeason.value !== 'all'
})

const availableSeasons = computed(() => {
  return episodesStore.seasons
})

// Watch for season filter changes to load the complete season
watch(selectedSeasonNumber, async (newSeason) => {
  if (newSeason !== null) {
    try {
      loadingMore.value = true
      await episodesStore.ensureSeasonLoaded(newSeason)
    } catch (error) {
      console.error(`Failed to load season ${newSeason}:`, error)
    } finally {
      loadingMore.value = false
    }
  }
})

// Setup infinite scroll observer
const setupInfiniteScroll = () => {
  if (!loadMoreTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0]
      if (target.isIntersecting && episodesStore.hasMoreSeasonsToLoad && !loadingMore.value && !episodesStore.loading) {
        loadMoreEpisodes()
      }
    },
    {
      rootMargin: '100px'
    }
  )

  observer.observe(loadMoreTrigger.value)
}

// Cleanup observer
const cleanupInfiniteScroll = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// Load more episodes (next batch of seasons)
const loadMoreEpisodes = async () => {
  if (loadingMore.value || !episodesStore.hasMoreSeasonsToLoad) return

  try {
    loadingMore.value = true
    await episodesStore.loadMoreSeasons(2)
  } catch (err) {
    console.error('Error loading more episodes:', err)
  } finally {
    loadingMore.value = false
  }
}

// Load more episodes manually (for button)
const handleLoadMore = () => {
  if (!loadingMore.value && episodesStore.hasMoreSeasonsToLoad) {
    loadMoreEpisodes()
  }
}

// Clear filters
const clearFilters = () => {
  selectedSeason.value = 'all'
  searchTerm.value = ''
}

// Retry loading data
const retryLoad = async () => {
  episodesStore.clearCache()
  selectedSeason.value = 'all'
  searchTerm.value = ''
  cleanupInfiniteScroll()

  try {
    await episodesStore.initializeStore()
    await nextTick()
    setupInfiniteScroll()
  } catch (error) {
    console.error('Failed to retry load:', error)
  }
}

// Initialize on mount
onMounted(async () => {
  try {
    await episodesStore.initializeStore()
    await nextTick()
    setupInfiniteScroll()
  } catch (error) {
    console.error('Failed to initialize:', error)
  }
})

onUnmounted(() => {
  cleanupInfiniteScroll()
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 sm:space-y-10">
    <HeroSection title="Browse Episodes" subtitle="Explore the complete collection of South Park episodes" />

    <!-- Error State -->
    <div v-if="episodesStore.error && !episodesStore.loading" class="text-center py-8 sm:py-12 space-y-4 px-2">
      <Film class="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground" />
      <h3 class="text-lg sm:text-xl font-semibold text-destructive">Unable to Load Episodes</h3>
      <p class="text-sm sm:text-base text-muted-foreground">{{ episodesStore.error }}</p>
      <div class="flex justify-center">
        <Button @click="retryLoad" class="w-full sm:w-auto flex items-center justify-center gap-2">
          <RotateCcw class="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="episodesStore.loading" class="space-y-6 sm:space-y-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 max-w-3xl mx-auto">
        <Skeleton class="h-11 flex-1" />
        <Skeleton class="h-11 w-full sm:w-44" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        <EpisodeCardSkeleton v-for="i in 12" :key="i" />
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6 sm:space-y-8">
      <!-- Search and Filters -->
      <SearchFilterBar
        v-model:search-term="searchTerm"
        v-model:selected-season="selectedSeason"
        :seasons="availableSeasons"
        :has-active-filters="hasActiveFilters"
        :loading-more="loadingMore"
        @clear-filters="clearFilters"
      />

      <!-- Results Summary -->
      <div class="text-center space-y-1">
        <div class="text-xs sm:text-sm text-muted-foreground">
          Showing <span class="text-primary font-medium">{{ filteredEpisodes.length }}</span> of <span class="text-primary font-medium">{{ episodesStore.allEpisodes.length }}</span> loaded episodes
          <span v-if="episodesStore.getTotalEpisodesCount > episodesStore.allEpisodes.length" class="text-muted-foreground/70">
            (<span class="text-primary/70">{{ episodesStore.getTotalEpisodesCount }}</span> total)
          </span>
        </div>
        <div v-if="episodesStore.hasMoreSeasonsToLoad || loadingMore" class="text-xs text-muted-foreground">
          Loaded <span class="text-primary/80">{{ episodesStore.getLoadedSeasons.length }}</span> of <span class="text-primary/80">{{ episodesStore.getTotalSeasonsCount }}</span> seasons ({{ episodesStore.getLoadingProgress }}%)
        </div>
      </div>

      <!-- Episodes Grid -->
      <div v-if="filteredEpisodes.length > 0" class="space-y-5 sm:space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <EpisodeCard
            v-for="(episode, index) in filteredEpisodes"
            :key="episode.id"
            :episode="episode"
            :index="index"
          />
        </div>

        <!-- Infinite Scroll Trigger -->
        <div
          ref="loadMoreTrigger"
          class="flex justify-center py-4 sm:py-8"
          v-show="episodesStore.hasMoreSeasonsToLoad || loadingMore"
        >
          <div v-if="loadingMore" class="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 class="h-4 w-4 animate-spin" />
            Loading more episodes...
          </div>
          <Button
            v-else-if="episodesStore.hasMoreSeasonsToLoad"
            variant="outline"
            @click="handleLoadMore"
            class="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Play class="h-4 w-4" />
            Load More Episodes
          </Button>
        </div>

        <!-- End of Results -->
        <div v-if="!episodesStore.hasMoreSeasonsToLoad && !loadingMore" class="text-center py-4 sm:py-8">
          <!-- Neon gradient separator line -->
          <div class="w-1/3 mx-auto h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-4"></div>
          <div class="text-sm text-muted-foreground">
            You've reached the end! All {{ episodesStore.allEpisodes.length }} episodes loaded.
          </div>
        </div>
      </div>

      <!-- No Results -->
      <EmptyState v-else :icon="Search" title="No episodes found">
        <div class="space-y-2">
          <p v-if="searchTerm" class="text-sm sm:text-base text-muted-foreground">
            No episodes found matching "<span class="font-medium">{{ searchTerm }}</span>"
          </p>
          <p v-else-if="selectedSeasonNumber" class="text-sm sm:text-base text-muted-foreground">
            No episodes found for Season {{ selectedSeasonNumber }}
          </p>
          <p v-else class="text-sm sm:text-base text-muted-foreground">
            No episodes are currently available
          </p>
          <div v-if="episodesStore.hasMoreSeasonsToLoad && !hasActiveFilters" class="mt-4 flex justify-center">
            <Button @click="handleLoadMore" variant="outline" class="w-full sm:w-auto flex items-center justify-center gap-2">
              <Play class="h-4 w-4" />
              Load More Episodes
            </Button>
          </div>
        </div>
        <div v-if="hasActiveFilters" class="flex justify-center">
          <Button variant="outline" @click="clearFilters" class="w-full sm:w-auto flex items-center justify-center gap-2">
            <Search class="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </EmptyState>
    </div>
  </div>
</template>
