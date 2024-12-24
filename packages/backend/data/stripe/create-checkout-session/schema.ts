import { selectPlanSchema } from "@mapform/db/schema";
import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  stripeCustomerId: selectPlanSchema.shape.stripeCustomerId,
  priceId: z.string(),
});

export type CreateCheckoutSessionSchema = z.infer<
  typeof createCheckoutSessionSchema
>;
