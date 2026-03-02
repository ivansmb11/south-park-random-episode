import { supabase } from '@/config/supabase'
import { UserProfileSchema, UpdateProfilePayloadSchema } from '@/core/schemas/profile.schema'
import type { UserProfile, UpdateProfilePayload } from '@/core/entities/profile.entity'

export const updateUserProfileUseCase = async (
  userId: string,
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  // Validate payload before sending
  const payloadParsed = UpdateProfilePayloadSchema.safeParse(payload)
  if (!payloadParsed.success) {
    console.error('[updateUserProfileUseCase] Payload validation error:', payloadParsed.error.flatten())
    throw new Error('Invalid profile data: ' + payloadParsed.error.issues.map(i => i.message).join(', '))
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...payloadParsed.data, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('[updateUserProfileUseCase] Error:', error)
    throw error
  }

  const parsed = UserProfileSchema.safeParse(data)
  if (!parsed.success) {
    console.error('[updateUserProfileUseCase] Response validation error:', parsed.error.flatten())
    return data as UserProfile
  }

  return parsed.data
}
