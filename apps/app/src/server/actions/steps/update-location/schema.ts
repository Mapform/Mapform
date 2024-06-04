import { z } from "zod";

export const updateStepLocationSchema = z.object({
  stepId: z.string(),
  data: z
    .object({
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
      zoom: z.coerce.number(),
      pitch: z.coerce.number(),
      bearing: z.coerce.number(),
    })
    .partial(),
});

export type UpdateStepLocationSchema = z.infer<typeof updateStepLocationSchema>;
