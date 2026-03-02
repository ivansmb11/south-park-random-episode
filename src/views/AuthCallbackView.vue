<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Redirect as soon as auth is confirmed — handles both
// "already authenticated" and "waiting for token processing"
watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (authenticated) router.replace('/')
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="flex flex-col items-center gap-4">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p class="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  </div>
</template>
