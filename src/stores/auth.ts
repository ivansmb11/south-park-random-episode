import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/core/entities/profile.entity'
import { supabase } from '@/config/supabase'
import type { UpdateProfilePayload } from '@/core/entities/profile.entity'
import { signInWithGoogleUseCase } from '@/core/use-cases/auth/sign-in-with-google.use-case'
import { signInWithSpotifyUseCase } from '@/core/use-cases/auth/sign-in-with-spotify.use-case'
import { signOutUseCase } from '@/core/use-cases/auth/sign-out.use-case'
import { getUserProfileUseCase } from '@/core/use-cases/auth/get-user-profile.use-case'
import { updateUserProfileUseCase } from '@/core/use-cases/auth/update-user-profile.use-case'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!session.value)

  const userDisplayName = computed(() => {
    return profile.value?.full_name
      || user.value?.user_metadata?.full_name
      || user.value?.email
      || 'User'
  })

  const userEmail = computed(() => {
    return user.value?.email || ''
  })

  const userAvatar = computed(() => {
    return profile.value?.avatar_url
      || user.value?.user_metadata?.avatar_url
      || ''
  })

  // Actions
  const initialize = async () => {
    try {
      loading.value = true

      const { data } = await supabase.auth.getSession()

      if (data.session) {
        session.value = data.session
        user.value = data.session.user
        await fetchProfile(data.session.user.id)
      }

      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null

        if (event === 'SIGNED_IN' && newSession?.user) {
          await fetchProfile(newSession.user.id)
        }

        if (event === 'SIGNED_OUT') {
          profile.value = null
        }
      })
    } catch (err) {
      console.error('[authStore] initialize error:', err)
      error.value = 'Failed to initialize auth'
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    try {
      error.value = null
      await signInWithGoogleUseCase()
    } catch (err: any) {
      error.value = err.message || 'Failed to sign in with Google'
      throw err
    }
  }

  const signInWithSpotify = async () => {
    try {
      error.value = null
      await signInWithSpotifyUseCase()
    } catch (err: any) {
      error.value = err.message || 'Failed to sign in with Spotify'
      throw err
    }
  }

  const signOut = async () => {
    try {
      error.value = null
      await signOutUseCase()
      user.value = null
      session.value = null
      profile.value = null
    } catch (err: any) {
      error.value = err.message || 'Failed to sign out'
      throw err
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      profile.value = await getUserProfileUseCase(userId)
    } catch (err) {
      console.warn('[authStore] Could not fetch profile:', err)
    }
  }

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!user.value) throw new Error('Not authenticated')
    try {
      error.value = null
      profile.value = await updateUserProfileUseCase(user.value.id, payload)
    } catch (err: any) {
      error.value = err.message || 'Failed to update profile'
      throw err
    }
  }

  return {
    // State
    user,
    session,
    profile,
    loading,
    error,

    // Getters
    isAuthenticated,
    userDisplayName,
    userEmail,
    userAvatar,

    // Actions
    initialize,
    signInWithGoogle,
    signInWithSpotify,
    signOut,
    fetchProfile,
    updateProfile,
  }
})
