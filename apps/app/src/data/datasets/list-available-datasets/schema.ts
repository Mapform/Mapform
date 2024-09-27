import { z } from "zod";

export const listAvailableDatasetsSchema = z.object({
  projectId: z.string(),
});

export type ListAvailableDatasetsSchema = z.infer<
  typeof listAvailableDatasetsSchema
>;
