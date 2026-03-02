<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import LayoutComponent from '@/components/LayoutComponent.vue'

const route = useRoute()
</script>

<template>
  <Toaster position="top-right" :rich-colors="true" theme="system" />
  <RouterView v-if="route.meta.requiresAuth === false" />
  <LayoutComponent v-else />
</template>
