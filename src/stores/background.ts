import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BackgroundImage {
  url: string
  alt: string
  episodeName?: string
  seasonNumber?: number
  episodeNumber?: number
}

export const useBackgroundStore = defineStore('background', () => {
  const currentBackground = ref<BackgroundImage | null>(null)
  const isEnabled = ref(true)

  const setBackground = (background: BackgroundImage | null) => {
    currentBackground.value = background
  }

  const clearBackground = () => {
    currentBackground.value = null
  }

  const toggleBackground = () => {
    isEnabled.value = !isEnabled.value
  }

  const enableBackground = () => {
    isEnabled.value = true
  }

  const disableBackground = () => {
    isEnabled.value = false
  }

  return {
    currentBackground,
    isEnabled,
    setBackground,
    clearBackground,
    toggleBackground,
    enableBackground,
    disableBackground
  }
})
