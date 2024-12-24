import { selectPlanSchema } from "@mapform/db/schema";
import { z } from "zod";

export const createBillingSessionSchema = z.object({
  stripeCustomerId: selectPlanSchema.shape.stripeCustomerId,
  stripeProductId: selectPlanSchema.shape.stripeProductId,
  workspaceSlug: selectPlanSchema.shape.workspaceSlug,
});

export type CreateBillingSessionSchema = z.infer<
  typeof createBillingSessionSchema
>;
