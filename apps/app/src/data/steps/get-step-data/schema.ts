import { z } from "zod";

export const getStepDataSchema = z.object({
  stepId: z.string(),
  bounds: z
    .object({
      minLat: z.number(),
      maxLat: z.number(),
      minLng: z.number(),
      maxLng: z.number(),
    })
    .optional(),
});

export type GetStepDataSchema = z.infer<typeof getStepDataSchema>;
