import { z } from "zod";

export const detailsSchema = z.object({
  id: z.string().min(1),
});

export type DetailsSchema = z.infer<typeof detailsSchema>;
