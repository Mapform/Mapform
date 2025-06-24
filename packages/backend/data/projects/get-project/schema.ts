import { z } from "zod/v4";

const filterSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("bounds"),
    bounds: z.object({
      north: z.number(),
      south: z.number(),
      east: z.number(),
      west: z.number(),
    }),
  }),
  z.object({
    type: z.literal("page"),
    page: z.number().min(0).default(0),
    perPage: z.number().min(1).default(50),
  }),
]);
export const getProjectSchema = z.object({
  projectId: z.string(),
  filter: filterSchema.optional(),
});
