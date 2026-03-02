import { supabase } from '@/config/supabase'

export const signInWithGoogleUseCase = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('[signInWithGoogleUseCase] Error:', error)
    throw error
  }

  return data
}
