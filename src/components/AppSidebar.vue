<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Sparkles,
  Film,
  Info,
  Shuffle,
} from "lucide-vue-next"
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { BUCKET_URLS } from '@/config/assets.bucket'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const { resolvedTheme } = useTheme()
const authStore = useAuthStore()

// Simple computed property that reacts to resolved theme
const logoUrl = computed(() => {
  return resolvedTheme.value === 'light' ? BUCKET_URLS.logoLight : BUCKET_URLS.logo
})

const userData = computed(() => ({
  name: authStore.userDisplayName,
  email: authStore.userEmail,
  avatar: authStore.userAvatar,
}))


const data = {
  teams: [
    {
      name: "South Park Episodes",
      logo: Film,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Episode of the Day",
      url: "/",
      icon: Sparkles,
      isActive: true,
    },
    {
      title: "Browse Episodes",
      url: "/episodes",
      icon: Film,
      items: [
        {
          title: "All Episodes",
          url: "/episodes",
        },
        {
          title: "Random Episode",
          url: "/random",
        },
      ],
    },
    {
      title: "About",
      url: "/about",
      icon: Info,
    },
  ],
  projects: [
    {
      name: "Random Generator",
      url: "/random",
      icon: Shuffle,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <!-- <TeamSwitcher :teams="data.teams" /> -->
      <div class="flex items-center justify-center py-2">
        <img :src="logoUrl" alt="South Park Sign" class="w-auto h-10 drop-shadow-[0_0_12px_oklch(0.75_0.18_210/0.3)] animate-float" />
      </div>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
