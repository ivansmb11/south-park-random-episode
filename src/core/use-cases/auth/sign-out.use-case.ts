import { supabase } from '@/config/supabase'

export const signOutUseCase = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('[signOutUseCase] Error:', error)
    throw error
  }
}
