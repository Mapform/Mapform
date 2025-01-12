import { z } from "zod";
import { insertEndingSchema } from "@mapform/db/schema";

export const createEndingSchema = z.discriminatedUnion("endingType", [
  z.object({
    endingType: z.literal("page"),
    projectId: insertEndingSchema.shape.projectId,
    pageTitle: insertEndingSchema.shape.pageTitle,
    pageContent: insertEndingSchema.shape.pageContent,
  }),
  z.object({
    endingType: z.literal("redirect"),
    projectId: insertEndingSchema.shape.projectId,
    redirectUrl: insertEndingSchema.shape.redirectUrl,
  }),
]);

export type CreateEndingSchema = z.infer<typeof createEndingSchema>;
