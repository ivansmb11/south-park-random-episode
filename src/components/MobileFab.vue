<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSidebar } from '@/components/ui/sidebar'
import { LayoutGrid, X, Sparkles, Dice6, Library, Info } from 'lucide-vue-next'

const { isMobile } = useSidebar()
const route = useRoute()
const router = useRouter()
const isOpen = ref(false)

const menuItems = [
  { label: 'Today', icon: Sparkles, to: '/' },
  { label: 'Random', icon: Dice6, to: '/random' },
  { label: 'Browse', icon: Library, to: '/episodes' },
  { label: 'About', icon: Info, to: '/about' },
]

const toggle = () => {
  isOpen.value = !isOpen.value
}

const navigate = (to: string) => {
  router.push(to)
  isOpen.value = false
}

// Close on route change
watch(() => route.path, () => {
  isOpen.value = false
})

// Close on escape
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}

// Close on outside click
const onClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.mobile-fab-container')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div v-if="isMobile" class="mobile-fab-container fixed bottom-28 right-4 z-50">
    <!-- Quick Menu -->
    <Transition name="fab-menu">
      <div v-if="isOpen" class="absolute bottom-16 right-0 flex flex-col items-end gap-2 mb-2">
        <button
          v-for="(item, index) in menuItems"
          :key="item.to"
          @click="navigate(item.to)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-full glass-card-heavy backdrop-blur-xl text-sm font-medium text-foreground active:scale-[0.95] transition-all duration-300"
          v-motion
          :initial="{ opacity: 0, scale: 0.8, y: 8 }"
          :enter="isOpen ? { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20, delay: index * 50 } } : undefined"
          :class="{ 'neon-border-primary text-primary': route.path === item.to }"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </button>
      </div>
    </Transition>

    <!-- FAB Button -->
    <button
      @click.stop="toggle"
      class="relative flex items-center justify-center w-14 h-14 rounded-full neon-btn-primary shadow-xl active:scale-[0.92] transition-transform"
      :class="{ 'animate-neon-glow-breathe': !isOpen }"
    >
      <Transition name="fab-icon" mode="out-in">
        <X v-if="isOpen" class="h-6 w-6" />
        <LayoutGrid v-else class="h-6 w-6" />
      </Transition>
    </button>
  </div>
</template>

<style scoped>
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: opacity 0.2s ease;
}
.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
}

.fab-icon-enter-active,
.fab-icon-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.fab-icon-enter-from {
  transform: rotate(-90deg);
  opacity: 0;
}
.fab-icon-leave-to {
  transform: rotate(90deg);
  opacity: 0;
}
</style>
