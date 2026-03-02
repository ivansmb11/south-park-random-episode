import { z } from 'zod'

export const DailyEpisodeSchema = z.object({
  id: z.number(),
  date: z.string(),
  tmdb_id: z.number(),
  season_number: z.number().int().positive(),
  episode_number: z.number().int().positive(),
  name: z.string().min(1),
  overview: z.string().default(''),
  air_date: z.string().nullable().optional(),
  vote_average: z.number().nullable().optional(),
  vote_count: z.number().nullable().optional(),
  runtime: z.number().nullable().optional(),
  still_path: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  created_at: z.string().optional(),
})

export const DailyEpisodeResponseSchema = z.object({
  data: DailyEpisodeSchema,
  source: z.enum(['db', 'edge-function']).optional(),
})

export type DailyEpisode = z.infer<typeof DailyEpisodeSchema>
export type DailyEpisodeResponse = z.infer<typeof DailyEpisodeResponseSchema>
