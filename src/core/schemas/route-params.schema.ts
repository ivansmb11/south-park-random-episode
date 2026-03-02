import { z } from 'zod'

export const EpisodeRouteParamsSchema = z.object({
  season: z.coerce.number().int().positive().max(100),
  episode: z.coerce.number().int().positive().max(100),
})

export type EpisodeRouteParams = z.infer<typeof EpisodeRouteParamsSchema>
