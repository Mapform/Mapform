import { z } from "zod";

export const searchPlacesSchema = z.object({
  query: z.string().min(1),
  bounds: z.array(z.number()).optional(),
});

export type SearchPlacesSchema = z.infer<typeof searchPlacesSchema>;
