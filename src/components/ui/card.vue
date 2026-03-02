<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface CardProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardProps>()
</script>

<template>
  <div :class="cn('glass-card rounded-2xl text-card-foreground', props.class)">
    <slot />
  </div>
</template>