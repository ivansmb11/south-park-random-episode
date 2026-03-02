<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Skeleton from '@/components/ui/skeleton.vue'
import HeroSection from '@/components/HeroSection.vue'
import { Dice6, ImageIcon } from 'lucide-vue-next'
import { useEpisodeCache } from '@/composables/useEpisodeCache'
import { useBackgroundStore } from '@/stores/background'
import type { Episode } from '@/core/entities/episode.entity'
import { getTMDBImageUrl } from '@/lib/tmdb-images'
import { formatDateToHumanReadable } from '@/utils/time'
import { BUCKET_URLS } from '@/config/assets.bucket'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const { getRandomEpisode, loading, hasError, error, clearError } = useEpisodeCache()
const backgroundStore = useBackgroundStore()
const randomEpisode = ref<Episode | null>(null)

const handleGetRandomEpisode = async () => {
  clearError()
  randomEpisode.value = null

  const episode = await getRandomEpisode()
  if (episode) {
    randomEpisode.value = episode
  }
  if (hasError.value) {
    toast.error(error.value || 'Failed to get random episode')
  }
}

// Watch for random episode changes and update background
watch(randomEpisode, (newEpisode) => {
  if (newEpisode) {
    const imageUrl = getTMDBImageUrl(newEpisode.still_path || newEpisode.poster_path, 'w1280')
    if (imageUrl) {
      backgroundStore.setBackground({
        url: imageUrl,
        alt: newEpisode.name,
        episodeName: newEpisode.name,
        seasonNumber: newEpisode.season_number,
        episodeNumber: newEpisode.episode_number
      })
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 sm:space-y-10 pb-28 md:pb-0">
    <HeroSection title="Random Episode" subtitle="Discover a random South Park episode!">
      <template #image>
        <img :src="BUCKET_URLS.signFour" alt="South Park Sign" class="mx-auto w-40 sm:w-48 md:w-56" />
      </template>
    </HeroSection>

    <div class="flex flex-col items-center space-y-6 sm:space-y-8">
      <!-- Desktop CTA -->
      <Button @click="handleGetRandomEpisode" size="lg"
        class="hidden md:inline-flex text-base sm:text-lg px-8 py-6 items-center justify-center gap-3 rounded-xl shadow-lg animate-neon-glow-breathe"
        :class="{ '!animate-none': loading }"
        :disabled="loading">
        <Dice6 class="h-5 w-5 drop-shadow-[0_0_6px_oklch(0.75_0.18_210/0.5)]" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Getting Random Episode...' : 'Get Random Episode' }}
      </Button>

      <!-- Loading State -->
      <Card v-if="loading && !randomEpisode" class="w-full">
        <div class="p-6 sm:p-8 space-y-4 text-center">
          <Skeleton class="h-6 w-48 mx-auto" />
          <Skeleton class="h-48 w-full rounded-xl" />
          <Skeleton class="h-6 w-40 mx-auto" />
          <Skeleton class="h-4 w-3/4 mx-auto" />
          <Skeleton class="h-11 w-full mt-2" />
        </div>
      </Card>

      <!-- Episode Result -->
      <Card
        v-if="randomEpisode && !loading"
        class="w-full rounded-2xl shadow-xl overflow-hidden"
        v-motion
        :initial="{ scale: 0.9, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 22 } }"
      >
        <!-- Thin neon gradient line at top -->
        <div class="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

        <!-- Episode Image -->
        <div class="relative w-full aspect-video bg-muted">
          <img v-if="getTMDBImageUrl(randomEpisode.still_path || randomEpisode.poster_path, 'w500')"
            :src="getTMDBImageUrl(randomEpisode.still_path || randomEpisode.poster_path, 'w500')!"
            :alt="randomEpisode.name" class="w-full h-full object-cover"
            loading="lazy" />
          <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
            <div class="text-center space-y-2">
              <ImageIcon class="h-10 w-10 mx-auto" />
              <p class="text-sm">No Image Available</p>
            </div>
          </div>
        </div>

        <!-- Episode Info -->
        <div class="p-5 sm:p-7 space-y-4">
          <div class="text-center space-y-2">
            <h2 class="text-xl sm:text-2xl font-bold text-primary neon-text-primary">
              {{ randomEpisode.name }}
            </h2>
            <p class="text-sm text-muted-foreground">
              Season {{ randomEpisode.season_number }}, Episode {{ randomEpisode.episode_number }}
            </p>
            <p v-if="randomEpisode.air_date" class="text-xs text-muted-foreground">
              Aired: {{ formatDateToHumanReadable(randomEpisode.air_date) }}
            </p>
          </div>

          <p v-if="randomEpisode.overview" class="text-sm text-muted-foreground text-center leading-relaxed">
            <Tooltip>
              <TooltipTrigger>
                <span class="cursor-pointer line-clamp-3">
                  {{ randomEpisode.overview }}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" class="max-w-[calc(100vw-2rem)] sm:w-96 bg-accent">
                <span class="text-sm text-foreground">
                  {{ randomEpisode.overview }}
                </span>
              </TooltipContent>
            </Tooltip>
          </p>

          <RouterLink :to="`/episode/${randomEpisode.season_number}/${randomEpisode.episode_number}`" class="block">
            <Button variant="glass" class="w-full h-11">
              View Episode Details
            </Button>
          </RouterLink>
        </div>
      </Card>
    </div>

    <!-- Sticky Bottom CTA (mobile only) -->
    <div class="fixed bottom-0 left-0 right-0 z-20 md:hidden glass-card-heavy px-4 pt-3" style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <Button @click="handleGetRandomEpisode" size="lg" class="w-full text-base py-5 flex items-center justify-center gap-2 rounded-xl shadow-lg"
        :disabled="loading">
        <Dice6 class="h-5 w-5" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Getting Random Episode...' : 'Get Random Episode' }}
      </Button>
    </div>
  </div>
</template>
