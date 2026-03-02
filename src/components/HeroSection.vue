<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div
    class="text-center space-y-3 sm:space-y-5 py-4 sm:py-6 md:py-8 relative"
    v-motion
    :initial="{ opacity: 0, y: 24, scale: 0.97 }"
    :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }"
  >
    <!-- Blurred gradient glow behind title -->
    <div class="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
      <div class="w-3/4 h-32 animated-gradient-bg opacity-20 blur-3xl rounded-full"></div>
    </div>
    <slot name="image" />
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-sp neon-text-primary">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
      {{ subtitle }}
    </p>
  </div>
</template>
