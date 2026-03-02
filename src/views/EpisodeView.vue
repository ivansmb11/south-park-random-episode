<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/card-header.vue'
import CardTitle from '@/components/ui/card-title.vue'
import CardContent from '@/components/ui/card-content.vue'
import Skeleton from '@/components/ui/skeleton.vue'
import StatCard from '@/components/StatCard.vue'
import { FileText, Calendar, Star, Clock, AlertCircle, ImageIcon } from 'lucide-vue-next'
import { useEpisodeCache } from '@/composables/useEpisodeCache'
import { useBackgroundStore } from '@/stores/background'
import type { Episode } from '@/core/entities/episode.entity'
import { getTMDBImageUrl } from '@/lib/tmdb-images'
import { formatDateToHumanReadable } from '@/utils/time'

interface Props {
  season: number
  episode: number
  invalidParams?: boolean
}

const props = defineProps<Props>()
const { getEpisode, loading, hasError, error, clearError } = useEpisodeCache()
const backgroundStore = useBackgroundStore()

const episodeData = ref<Episode | null>(null)

const formattedAirDate = computed(() => {
  if (!episodeData.value?.air_date) return null
  return formatDateToHumanReadable(episodeData.value.air_date)
})

const voteDisplay = computed(() => {
  if (!episodeData.value?.vote_average) return null
  return (episodeData.value.vote_average).toFixed(1)
})

const loadEpisode = async () => {
  if (props.invalidParams) return
  clearError()
  const episode = await getEpisode(props.season, props.episode)
  if (episode) {
    episodeData.value = episode
  }
}

// Watch for episode data changes and update background
watch(episodeData, (newEpisodeData) => {
  if (newEpisodeData) {
    const imageUrl = getTMDBImageUrl(newEpisodeData.still_path || newEpisodeData.poster_path, 'w1280')
    if (imageUrl) {
      backgroundStore.setBackground({
        url: imageUrl,
        alt: newEpisodeData.name,
        episodeName: newEpisodeData.name,
        seasonNumber: newEpisodeData.season_number,
        episodeNumber: newEpisodeData.episode_number
      })
    }
  }
}, { immediate: true })

onMounted(() => {
  loadEpisode()
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 sm:space-y-10">
    <!-- Invalid Params -->
    <div v-if="invalidParams" class="max-w-lg mx-auto pt-8">
      <Card class="border-destructive">
        <CardHeader class="text-center">
          <CardTitle class="text-destructive flex items-center gap-2 justify-center text-lg sm:text-xl">
            <AlertCircle class="h-5 w-5 sm:h-6 sm:w-6" />
            Invalid Episode URL
          </CardTitle>
        </CardHeader>
        <CardContent class="text-center space-y-4">
          <p class="text-sm text-muted-foreground">The season and episode numbers in the URL are not valid.</p>
          <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <RouterLink to="/" class="block">
              <Button class="w-full">Back to Home</Button>
            </RouterLink>
            <RouterLink to="/episodes" class="block">
              <Button variant="outline" class="w-full">Browse Episodes</Button>
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="space-y-6 sm:space-y-8">
      <div class="text-center space-y-4">
        <Skeleton class="h-10 sm:h-12 w-3/4 mx-auto" />
        <Skeleton class="h-5 sm:h-6 w-1/2 mx-auto" />
      </div>

      <div class="lg:grid lg:grid-cols-2 lg:gap-10 space-y-6 lg:space-y-0">
        <Skeleton class="aspect-video w-full rounded-2xl" />
        <div class="space-y-4">
          <Skeleton class="h-6 w-1/3" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-5/6" />
          <Skeleton class="h-4 w-4/5" />
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Skeleton v-for="i in 4" :key="i" class="h-20 rounded-2xl" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="max-w-lg mx-auto pt-8">
      <Card class="border-destructive">
        <CardHeader class="text-center">
          <CardTitle class="text-destructive flex items-center gap-2 justify-center text-lg sm:text-xl">
            <AlertCircle class="h-5 w-5 sm:h-6 sm:w-6" />
            Failed to Load Episode
          </CardTitle>
        </CardHeader>
        <CardContent class="text-center space-y-4">
          <p class="text-sm text-muted-foreground">{{ error }}</p>
          <p class="text-xs sm:text-sm text-muted-foreground">
            Season {{ props.season }}, Episode {{ props.episode }}
          </p>
          <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Button @click="loadEpisode" variant="outline" class="w-full sm:w-auto">
              Try Again
            </Button>
            <RouterLink to="/" class="block">
              <Button class="w-full">Back to Home</Button>
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Episode Content -->
    <div v-else-if="episodeData" class="space-y-8 sm:space-y-10 pb-28 md:pb-0">
      <!-- Two-column layout -->
      <div class="lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-12 space-y-6 sm:space-y-8 lg:space-y-0 pt-2 sm:pt-4 lg:pt-8">
        <!-- Left: Image -->
        <div
          class="space-y-6"
          v-motion
          :initial="{ opacity: 0, x: -24, scale: 0.97 }"
          :enter="{ opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } }"
        >
          <div
            class="relative w-full aspect-video lg:aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-xl neon-border-primary">
            <img v-if="getTMDBImageUrl(episodeData.still_path || episodeData.poster_path, 'w780')"
              :src="getTMDBImageUrl(episodeData.still_path || episodeData.poster_path, 'w780')!"
              :alt="episodeData.name" class="w-full h-full object-cover"
              loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
              <div class="text-center space-y-3">
                <ImageIcon class="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
                <p class="text-sm">No Episode Image Available</p>
              </div>
            </div>

            <!-- Title Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_270/0.9)] via-black/30 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white">
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1.5 drop-shadow-lg leading-tight">
                {{ episodeData.name }}
              </h2>
              <p class="text-sm sm:text-base lg:text-lg text-white/90 drop-shadow-md">
                Season {{ episodeData.season_number }}, Episode {{ episodeData.episode_number }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Overview + Stats -->
        <div
          class="space-y-6"
          v-motion
          :initial="{ opacity: 0, x: 24, scale: 0.97 }"
          :enter="{ opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22, delay: 150 } }"
        >
          <!-- Episode Overview -->
          <Card v-if="episodeData.overview">
            <CardHeader>
              <CardTitle class="text-lg sm:text-xl flex items-center gap-2">
                <FileText class="h-5 w-5 text-primary" />
                Episode Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {{ episodeData.overview }}
              </p>
            </CardContent>
          </Card>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <StatCard :value="episodeData.season_number" label="Season" />
            <StatCard :value="episodeData.episode_number" label="Episode" />
            <StatCard
              v-if="voteDisplay"
              :icon="Star"
              :value="voteDisplay"
              label="Rating"
              icon-class="text-yellow-500 fill-current"
            />
            <StatCard
              v-if="formattedAirDate"
              :icon="Calendar"
              :value="formattedAirDate"
              label="Air Date"
            />
            <StatCard
              v-if="episodeData.runtime"
              :icon="Clock"
              :value="`${episodeData.runtime} min`"
              label="Runtime"
            />
          </div>
        </div>
      </div>

      <!-- Navigation (desktop only) -->
      <div class="hidden md:flex gap-4 justify-center pt-2">
        <RouterLink to="/">
          <Button variant="outline" class="h-11 px-6">
            Back to Home
          </Button>
        </RouterLink>
        <RouterLink to="/episodes">
          <Button class="h-11 px-6">
            Browse All Episodes
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- Sticky Bottom Nav (mobile only) -->
    <div v-if="episodeData && !invalidParams" class="fixed bottom-0 left-0 right-0 z-20 md:hidden glass-card-heavy px-4 pt-3" style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div class="flex gap-3">
        <RouterLink to="/" class="flex-1">
          <Button variant="outline" class="w-full h-11 active:scale-[0.96]">
            Home
          </Button>
        </RouterLink>
        <RouterLink to="/episodes" class="flex-1">
          <Button class="w-full h-11 active:scale-[0.96]">
            Browse All
          </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
