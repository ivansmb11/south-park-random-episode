<script setup lang="ts">
import Card from '@/components/ui/card.vue'
import Skeleton from '@/components/ui/skeleton.vue'
</script>

<template>
  <Card class="overflow-hidden">
    <div class="aspect-video skeleton-shimmer"></div>
    <div class="p-4 sm:p-5 space-y-3">
      <Skeleton class="h-5 w-full" />
      <Skeleton class="h-3.5 w-2/3" />
      <Skeleton class="h-3.5 w-full" />
      <Skeleton class="h-3.5 w-4/5" />
      <Skeleton class="h-9 w-full mt-1" />
    </div>
  </Card>
</template>
