import { z } from "zod";

export const createLayerSchema = z
  .object({
    name: z.string().optional(),
    type: z.enum(["POINT"]),
    stepId: z.string(),
    formId: z.string(),
    datasetId: z.string(),
    pointColumnId: z.string().optional(),
  })
  .refine((input) => {
    // Schema is invalid when type is POINT and pointColumnId is not provided
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- This error will go away once I add more typesl
    if (input.type === "POINT" && input.pointColumnId === undefined) {
      return false;
    }

    return true;
  });

export type CreateLayerSchema = z.infer<typeof createLayerSchema>;
