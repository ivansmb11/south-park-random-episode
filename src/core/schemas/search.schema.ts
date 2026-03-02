import { z } from 'zod'

export const SearchInputSchema = z.object({
  term: z.string().max(200).trim().default(''),
  seasonFilter: z.number().int().positive().nullable().default(null),
})

export type SearchInput = z.infer<typeof SearchInputSchema>
