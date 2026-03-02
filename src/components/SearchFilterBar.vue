<script setup lang="ts">
import Input from '@/components/ui/input.vue'
import Button from '@/components/ui/button.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, X, Loader2 } from 'lucide-vue-next'
import type { Season } from '@/core/entities/episode.entity'

const searchTerm = defineModel<string>('searchTerm', { default: '' })
const selectedSeason = defineModel<string>('selectedSeason', { default: 'all' })

defineProps<{
  seasons: Season[]
  hasActiveFilters: boolean
  loadingMore?: boolean
}>()

const emit = defineEmits<{
  clearFilters: []
}>()
</script>

<template>
  <div class="space-y-3 sm:space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 max-w-3xl mx-auto">
      <!-- Search Input -->
      <div class="relative flex-1 group/search">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300 group-focus-within/search:text-primary group-focus-within/search:drop-shadow-[0_0_6px_oklch(0.75_0.18_210/0.4)]" />
        <Input
          v-model="searchTerm"
          type="text"
          placeholder="Search episodes..."
          class="pl-10"
        />
      </div>

      <!-- Season Filter (shadcn Select) -->
      <div class="relative w-full sm:w-48">
        <Select v-model="selectedSeason">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="All Seasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            <SelectItem
              v-for="season in seasons"
              :key="season.id"
              :value="String(season.season_number)"
            >
              Season {{ season.season_number }}
            </SelectItem>
          </SelectContent>
        </Select>
        <div v-if="loadingMore && selectedSeason !== 'all'" class="absolute right-10 top-1/2 transform -translate-y-1/2">
          <Loader2 class="h-3 w-3 animate-spin text-muted-foreground" />
        </div>
      </div>
    </div>

    <!-- Active Filters & Clear Button -->
    <div v-if="hasActiveFilters" class="flex items-center justify-center gap-2">
      <Filter class="h-4 w-4 text-primary" />
      <span class="text-sm text-muted-foreground">Filters active</span>
      <Button
        variant="ghost"
        size="sm"
        @click="emit('clearFilters')"
        class="flex items-center gap-1"
      >
        <X class="h-3 w-3" />
        Clear All
      </Button>
    </div>
  </div>
</template>
