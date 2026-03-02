<script setup lang="ts">
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { BUCKET_URLS } from '@/config/assets.bucket'
import { useTheme } from '@/composables/useTheme'
import { computed } from 'vue'

const authStore = useAuthStore()
const { resolvedTheme } = useTheme()

const logoUrl = computed(() => {
  return resolvedTheme.value === 'light' ? BUCKET_URLS.logoLight : BUCKET_URLS.logo
})

const handleSignIn = async () => {
  try {
    await authStore.signInWithGoogle()
  } catch {
    toast.error(authStore.error || 'Failed to sign in with Google')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center animated-gradient-bg px-4 py-8">
    <div
      class="w-full max-w-sm space-y-6 sm:space-y-8 rounded-2xl glass-card-heavy neon-border-primary p-7 sm:p-10"
      v-motion
      :initial="{ opacity: 0, y: 20, scale: 0.9 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }"
    >
      <div class="flex flex-col items-center gap-3 sm:gap-4">
        <img :src="logoUrl" alt="South Park" class="h-14 sm:h-16 w-auto drop-shadow-[0_0_16px_oklch(0.75_0.18_210/0.4)]" />
        <h1 class="text-xl font-bold text-foreground font-sp neon-text-primary">Welcome</h1>
        <p class="text-sm text-muted-foreground text-center px-2">
          Sign in to discover random South Park episodes
        </p>
      </div>

      <button
        @click="handleSignIn"
        class="flex w-full items-center justify-center gap-3 rounded-xl glass-card px-4 py-3 text-sm font-bold text-foreground transition-all duration-300 hover:neon-border-primary active:scale-[0.97]"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  </div>
</template>
