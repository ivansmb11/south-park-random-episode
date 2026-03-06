import { supabase } from '@/config/supabase'

export const signInWithSpotifyUseCase = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('[signInWithSpotifyUseCase] Error:', error)
    throw error
  }

  return data
}
