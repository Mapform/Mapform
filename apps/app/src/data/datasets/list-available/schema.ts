import { z } from "zod";

export const listAvailableSchema = z.object({
  formId: z.string(),
});

export type ListAvailableSchema = z.infer<typeof listAvailableSchema>;
