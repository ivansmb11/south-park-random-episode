import { z } from 'zod'

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  full_name: z.string().max(100).nullable(),
  avatar_url: z.string().url().nullable().optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, hyphens, and underscores')
    .nullable(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format')
    .nullable(),
  provider: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const UpdateProfilePayloadSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be under 30 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Only letters, numbers, dots, hyphens, and underscores')
    .optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>
export type UpdateProfilePayload = z.infer<typeof UpdateProfilePayloadSchema>
