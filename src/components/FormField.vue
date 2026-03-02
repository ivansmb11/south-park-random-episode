<script setup lang="ts">
defineProps<{
  label: string
  error?: string
  htmlFor?: string
  hint?: string
}>()
</script>

<template>
  <div class="space-y-1.5 sm:space-y-2">
    <label v-if="label" :for="htmlFor" class="text-sm font-medium text-foreground tracking-wide">{{ label }}</label>
    <slot />
    <p v-if="error" class="text-xs text-destructive neon-text-accent">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-muted-foreground">{{ hint }}</p>
  </div>
</template>
