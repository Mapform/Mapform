import { z } from "zod";

export const getStepDataSchema = z.object({
  stepId: z.string(),
  bounds: z
    .object({
      minLat: z.coerce.number(),
      maxLat: z.coerce.number(),
      minLng: z.coerce.number(),
      maxLng: z.coerce.number(),
    })
    .optional(),
});

export type GetStepDataSchema = z.infer<typeof getStepDataSchema>;
