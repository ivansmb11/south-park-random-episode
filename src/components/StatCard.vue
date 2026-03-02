<script setup lang="ts">
import Card from '@/components/ui/card.vue'
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  value: string | number
  label: string
  iconClass?: string
}>()
</script>

<template>
  <Card class="hover:neon-border-primary transition-all duration-300">
    <div class="px-3 py-4 sm:px-4 sm:py-5 text-center space-y-1.5">
      <component v-if="icon" :is="icon" class="h-5 w-5 mx-auto neon-text-primary" :class="iconClass ?? 'text-primary'" />
      <div class="text-lg sm:text-xl font-bold text-primary leading-tight">{{ value }}</div>
      <p class="text-xs text-muted-foreground">{{ label }}</p>
    </div>
  </Card>
</template>
