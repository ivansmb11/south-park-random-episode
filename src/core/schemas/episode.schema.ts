import { z } from 'zod'

export const EpisodeSchema = z.object({
  id: z.number(),
  season_number: z.number().int().positive(),
  episode_number: z.number().int().positive(),
  name: z.string().min(1),
  overview: z.string().default(''),
  air_date: z.string().nullable().default(''),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  runtime: z.number().nullable().optional(),
  still_path: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
}).passthrough()

export const SeasonSchema = z.object({
  id: z.number(),
  air_date: z.string().nullable(),
  episode_count: z.number().int().optional(), // Only present in series details, not season endpoint
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable().optional(),
  season_number: z.number().int(),
  episodes: z.array(EpisodeSchema).optional(),
}).passthrough()

export const TVSeriesSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  first_air_date: z.string(),
  last_air_date: z.string(),
  number_of_episodes: z.number().int(),
  number_of_seasons: z.number().int(),
  seasons: z.array(SeasonSchema),
}).passthrough()

export type Episode = z.infer<typeof EpisodeSchema>
export type Season = z.infer<typeof SeasonSchema>
export type TVSeries = z.infer<typeof TVSeriesSchema>

export interface TMDBResponse<T> {
  data: T
  success: boolean
  status_code?: number
  status_message?: string
}
