<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  title: string
  description?: string
}>()
</script>

<template>
  <div class="text-center py-10 sm:py-16 px-2">
    <div class="space-y-4">
      <component
        v-if="icon"
        :is="icon"
        class="h-14 w-14 sm:h-20 sm:w-20 mx-auto text-primary/60 neon-text-primary"
      />
      <h3 class="text-xl sm:text-2xl font-semibold">{{ title }}</h3>
      <p v-if="description" class="text-sm sm:text-base text-muted-foreground">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>
