import { z } from "zod";

export const updateStepSchema = z.object({
  stepId: z.string(),
  data: z.object({
    formId: z.string().optional(),
    // TODO: This should be made more strict (needs to exactly match blocknote structure: https://www.blocknotejs.org/docs/editor-basics/document-structure)
    description: z.any().optional(),
    title: z.string().optional(),
    zoom: z.number().optional(),
    bearing: z.number().optional(),
    pitch: z.number().optional(),
    contentViewType: z.any().optional(),
    layerOrder: z.array(z.string()).optional(),
  }),
});

export type UpdateStepSchema = z.infer<typeof updateStepSchema>;
