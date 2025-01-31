import { z } from "zod";

export const deleteEndingSchema = z.object({
  endingId: z.string(),
});

export type DeleteEndingSchema = z.infer<typeof deleteEndingSchema>;
