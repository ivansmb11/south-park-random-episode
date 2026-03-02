import { supabase } from '@/config/supabase'
import { UserProfileSchema } from '@/core/schemas/profile.schema'
import type { UserProfile } from '@/core/entities/profile.entity'

export const getUserProfileUseCase = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[getUserProfileUseCase] Error:', error)
    throw error
  }

  const parsed = UserProfileSchema.safeParse(data)
  if (!parsed.success) {
    console.error('[getUserProfileUseCase] Validation error:', parsed.error.flatten())
    // Return raw data as fallback to avoid breaking auth flow
    return data as UserProfile
  }

  return parsed.data
}
