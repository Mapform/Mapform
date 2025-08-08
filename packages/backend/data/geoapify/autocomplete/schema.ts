import { z } from "zod";

export const autocompleteSchema = z.object({
  query: z.string().min(1),
  bounds: z.array(z.number()).optional(),
});

export type AutocompleteSchema = z.infer<typeof autocompleteSchema>;
