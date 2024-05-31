import { z } from "zod";

export const createStepSchema = z.object({
  formId: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    zoom: z.number(),
    pitch: z.number(),
    bearing: z.number(),
  }),
});

export type CreateStepSchema = z.infer<typeof createStepSchema>;
