<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Skeleton from '@/components/ui/skeleton.vue'
import { Badge } from '@/components/ui/badge'
import HeroSection from '@/components/HeroSection.vue'
import StatCard from '@/components/StatCard.vue'
import { Calendar, Star, Clock, Sparkles, Dice6, ImageIcon, RotateCcw, Play } from 'lucide-vue-next'
import { useDailyEpisode } from '@/composables/useDailyEpisode'
import { useBackgroundStore } from '@/stores/background'
import { getTMDBImageUrl, generateSrcSet } from '@/lib/tmdb-images'
import { formatDateToHumanReadable } from '@/utils/time'
import { BUCKET_URLS } from '@/config/assets.bucket'

const { dailyEpisode, loading, hasError, error, fetchDailyEpisode, clearError } = useDailyEpisode()
const backgroundStore = useBackgroundStore()

const todayFormatted = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const handleRetry = async () => {
  clearError()
  await fetchDailyEpisode()
  if (hasError.value) {
    toast.error(error.value || 'Failed to get daily episode')
  }
}

// Update background when episode loads
watch(dailyEpisode, (ep) => {
  if (ep) {
    const imageUrl = getTMDBImageUrl(ep.still_path || ep.poster_path, 'w1280')
    if (imageUrl) {
      backgroundStore.setBackground({
        url: imageUrl,
        alt: ep.name,
        episodeName: ep.name,
        seasonNumber: ep.season_number,
        episodeNumber: ep.episode_number,
      })
    }
  }
})

onMounted(async () => {
  await fetchDailyEpisode()
  if (hasError.value) {
    toast.error(error.value || 'Failed to get daily episode')
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 sm:space-y-10 pb-28 md:pb-0">
    <HeroSection title="Episode of the Day" :subtitle="todayFormatted">
      <template #image>
        <img :src="BUCKET_URLS.fourCharacters" alt="South Park Characters" class="mx-auto w-40 sm:w-48 md:w-56" />
      </template>
    </HeroSection>

    <!-- Loading State -->
    <Card v-if="loading && !dailyEpisode" class="w-full rounded-2xl overflow-hidden">
      <Skeleton class="w-full aspect-video" />
      <div class="p-5 sm:p-7 space-y-4">
        <Skeleton class="h-7 w-64 mx-auto" />
        <Skeleton class="h-4 w-40 mx-auto" />
        <Skeleton class="h-16 w-full" />
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Skeleton class="h-20" />
          <Skeleton class="h-20" />
          <Skeleton class="h-20" />
          <Skeleton class="h-20" />
        </div>
        <Skeleton class="h-11 w-full" />
      </div>
    </Card>

    <!-- Error State -->
    <Card v-else-if="hasError && !dailyEpisode" class="w-full rounded-2xl p-8 text-center space-y-4">
      <RotateCcw class="h-10 w-10 mx-auto text-muted-foreground" />
      <p class="text-muted-foreground">{{ error || 'Something went wrong' }}</p>
      <Button @click="handleRetry" class="gap-2">
        <RotateCcw class="h-4 w-4" />
        Try Again
      </Button>
    </Card>

    <!-- Episode of the Day Card -->
    <Card
      v-else-if="dailyEpisode"
      class="w-full rounded-2xl shadow-xl overflow-hidden"
      v-motion
      :initial="{ scale: 0.9, opacity: 0 }"
      :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 22 } }"
    >
      <!-- Neon gradient top line -->
      <div class="h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

      <!-- Episode Image -->
      <div class="relative w-full aspect-video bg-muted">
        <img
          v-if="getTMDBImageUrl(dailyEpisode.still_path || dailyEpisode.poster_path, 'w780')"
          :src="getTMDBImageUrl(dailyEpisode.still_path || dailyEpisode.poster_path, 'w780')!"
          :srcset="generateSrcSet(dailyEpisode.still_path || dailyEpisode.poster_path, [
            { size: 'w342', width: 342 },
            { size: 'w500', width: 500 },
            { size: 'w780', width: 780 },
          ]) ?? undefined"
          sizes="(max-width: 640px) 100vw, 672px"
          :alt="dailyEpisode.name"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
          <div class="text-center space-y-2">
            <ImageIcon class="h-10 w-10 mx-auto" />
            <p class="text-sm">No Image Available</p>
          </div>
        </div>

        <!-- Bottom gradient overlay -->
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-7 flex flex-col justify-end gap-2">
          <Badge class="w-fit animate-neon-glow-breathe gap-1.5 bg-primary/90 text-primary-foreground border-primary/50">
            <Sparkles class="h-3.5 w-3.5" />
            EPISODE OF THE DAY
          </Badge>
          <h2 class="text-2xl sm:text-3xl font-bold text-white neon-text-primary drop-shadow-lg">
            {{ dailyEpisode.name }}
          </h2>
          <p class="text-sm text-white/80">
            Season {{ dailyEpisode.season_number }}, Episode {{ dailyEpisode.episode_number }}
          </p>
        </div>
      </div>

      <!-- Episode Details -->
      <div class="p-5 sm:p-7 space-y-5">
        <!-- Overview -->
        <p v-if="dailyEpisode.overview" class="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {{ dailyEpisode.overview }}
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            :icon="Play"
            :value="`S${dailyEpisode.season_number}`"
            label="Season"
          />
          <StatCard
            :icon="Play"
            :value="`E${dailyEpisode.episode_number}`"
            label="Episode"
          />
          <StatCard
            v-if="dailyEpisode.vote_average"
            :icon="Star"
            :value="dailyEpisode.vote_average.toFixed(1)"
            label="Rating"
            icon-class="text-yellow-500"
          />
          <StatCard
            v-if="dailyEpisode.air_date"
            :icon="Calendar"
            :value="formatDateToHumanReadable(dailyEpisode.air_date)"
            label="Air Date"
          />
          <StatCard
            v-if="dailyEpisode.runtime"
            :icon="Clock"
            :value="`${dailyEpisode.runtime}m`"
            label="Runtime"
          />
        </div>

        <!-- CTA Buttons (desktop) -->
        <div class="hidden md:flex gap-3">
          <RouterLink
            :to="`/episode/${dailyEpisode.season_number}/${dailyEpisode.episode_number}`"
            class="flex-1"
          >
            <Button class="w-full h-11 gap-2">
              <Play class="h-4 w-4" />
              View Episode Details
            </Button>
          </RouterLink>
          <RouterLink to="/random" class="flex-1">
            <Button variant="outline" class="w-full h-11 gap-2">
              <Dice6 class="h-4 w-4" />
              Try Random
            </Button>
          </RouterLink>
        </div>
      </div>
    </Card>

    <!-- Mobile sticky bar -->
    <div
      v-if="dailyEpisode"
      class="fixed bottom-0 left-0 right-0 z-20 md:hidden glass-card-heavy px-4 pt-3"
      style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));"
    >
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div class="flex gap-3">
        <RouterLink
          :to="`/episode/${dailyEpisode.season_number}/${dailyEpisode.episode_number}`"
          class="flex-1"
        >
          <Button size="lg" class="w-full text-sm py-5 flex items-center justify-center gap-2 rounded-xl shadow-lg">
            <Play class="h-4 w-4" />
            View Details
          </Button>
        </RouterLink>
        <RouterLink to="/random" class="flex-1">
          <Button size="lg" variant="outline" class="w-full text-sm py-5 flex items-center justify-center gap-2 rounded-xl shadow-lg">
            <Dice6 class="h-4 w-4" />
            Random
          </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
