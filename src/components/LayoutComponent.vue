<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { useBackgroundStore } from '@/stores/background'
import Button from '@/components/ui/button.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import MobileFab from '@/components/MobileFab.vue'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Moon, Sun, RotateCcw } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
const backgroundStore = useBackgroundStore()

const getThemeIcon = () => {
  if (theme.value === 'light') return Moon
  if (theme.value === 'dark') return Sun
  return RotateCcw
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="relative min-h-screen">
      <!-- Global Background Image (inside SidebarInset) -->
      <div v-if="backgroundStore.currentBackground && backgroundStore.isEnabled" class="absolute inset-0 z-0">
        <img :src="backgroundStore.currentBackground.url" :alt="backgroundStore.currentBackground.alt"
          class="w-full h-full object-cover" />
        <!-- Fade overlay with depth gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/90"></div>
      </div>

      <div class="relative z-10 flex min-h-screen flex-col">
        <header
          class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 glass-card-heavy border-b border-border/30">
          <!-- Neon gradient bottom line -->
          <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          <div class="flex items-center gap-3 px-4 sm:px-6">
            <SidebarTrigger class="-ml-1 hidden md:inline-flex" />
            <div class="hidden md:block h-4 w-px bg-sidebar-border/30" />
            <div class="text-lg font-bold text-foreground md:text-xl font-sp neon-text-primary">South Park Episodes</div>
          </div>
          <div class="ml-auto flex items-center gap-2 px-4 sm:px-6">
            <Button variant="ghost" size="icon" @click="toggleTheme" :title="`Current theme: ${theme}`"
              class="hover:shadow-[0_0_10px_oklch(0.75_0.18_210/0.15)] rounded-full">
              <component :is="getThemeIcon()" class="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main class="flex-1 overflow-auto">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10">
            <RouterView v-slot="{ Component, route }">
              <Transition name="route" mode="out-in">
                <component :is="Component" :key="route.path" />
              </Transition>
            </RouterView>
          </div>
        </main>
      </div>

      <MobileFab />
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
.route-enter-active {
  animation: sp-fade-up 0.3s ease-out;
}
.route-leave-active {
  animation: sp-fade-in 0.15s ease-out reverse;
}
</style>
