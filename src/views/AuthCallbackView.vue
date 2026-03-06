<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const errorMessage = ref<string | null>(null)

onMounted(() => {
  const error = route.query.error_description as string | undefined
    || route.hash?.match(/error_description=([^&]*)/)?.[1]

  if (error) {
    errorMessage.value = decodeURIComponent(error.replace(/\+/g, ' '))
  }
})

watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (authenticated) router.replace('/')
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div v-if="errorMessage" class="flex flex-col items-center gap-4 text-center max-w-sm">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <svg class="h-6 w-6 text-destructive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <p class="text-sm text-muted-foreground">{{ errorMessage }}</p>
      <button
        @click="router.replace('/login')"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to Login
      </button>
    </div>
    <div v-else class="flex flex-col items-center gap-4">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p class="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  </div>
</template>
