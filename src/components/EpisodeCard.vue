<script setup lang="ts">
import Card from '@/components/ui/card.vue'
import Button from '@/components/ui/button.vue'
import { Film, Calendar, Play, Star } from 'lucide-vue-next'
import type { Episode } from '@/core/entities/episode.entity'
import { getTMDBImageUrl, generateSrcSet } from '@/lib/tmdb-images'

const props = defineProps<{
  episode: Episode
  index?: number
}>()

const formatTitle = (ep: Episode) =>
  `S${ep.season_number.toString().padStart(2, '0')}E${ep.episode_number.toString().padStart(2, '0')}: ${ep.name}`

const imageSrc = getTMDBImageUrl(props.episode.still_path || props.episode.poster_path, 'w342')
const srcset = generateSrcSet(props.episode.still_path || props.episode.poster_path, [
  { size: 'w185', width: 185 },
  { size: 'w342', width: 342 },
  { size: 'w500', width: 500 },
])

const delay = Math.min((props.index ?? 0) * 50, 400)
</script>

<template>
  <RouterLink
    :to="`/episode/${episode.season_number}/${episode.episode_number}`"
    class="block h-full"
  >
    <Card
      class="group h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:neon-border-primary sp-touch-card overflow-hidden"
      v-motion
      :initial="{ opacity: 0, y: 20, scale: 0.97 }"
      :visible-once="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22, delay } }"
    >
      <!-- Episode Image -->
      <div class="aspect-video overflow-hidden bg-muted relative shrink-0">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          :srcset="srcset ?? undefined"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          :alt="episode.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div v-else class="flex items-center justify-center h-full">
          <Film class="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
        </div>

        <!-- Play Icon Overlay (neon-tinted) -->
        <div class="absolute inset-0 bg-gradient-to-t from-[oklch(0.75_0.18_210/0.4)] to-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play class="h-10 w-10 text-white fill-white drop-shadow-[0_0_8px_oklch(0.75_0.18_210/0.6)]" />
        </div>
      </div>

      <!-- Card Body -->
      <div class="flex flex-col flex-1 p-4 sm:p-5 space-y-3">
        <!-- Title -->
        <h3 class="text-sm sm:text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {{ formatTitle(episode) }}
        </h3>

        <!-- Meta row -->
        <div class="flex items-center gap-3 text-xs text-muted-foreground">
          <span class="flex items-center gap-1">
            <Calendar class="h-3 w-3 shrink-0" />
            {{ episode.air_date }}
          </span>
          <span v-if="episode.vote_average" class="flex items-center gap-1 ml-auto">
            <Star class="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
            {{ episode.vote_average.toFixed(1) }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">
          {{ episode.overview || 'No description available.' }}
        </p>

        <!-- CTA -->
        <Button size="sm" class="w-full flex items-center justify-center gap-2 mt-auto">
          <Play class="h-3.5 w-3.5" />
          Watch Episode
        </Button>
      </div>
    </Card>
  </RouterLink>
</template>
