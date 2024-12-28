import { db } from "@mapform/db";
import { plans } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { Stripe } from "stripe";
import { env } from "../env.mjs";
import { PLANS } from "../constants/plans";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const existingPlan = await db.query.plans.findFirst({
    where: eq(plans.stripeCustomerId, customerId),
  });

  if (!existingPlan) {
    console.error(`No plan found for customer ID ${customerId}.`);
    return;
  }

  if (status === "active" || status === "trialing") {
    const plan = subscription.items.data[0]?.plan;

    await db
      .update(plans)
      .set({
        stripeSubscriptionId: subscriptionId,
        stripeProductId: plan?.product as string,
        name: (plan?.product as Stripe.Product).name,
        subscriptionStatus: status,
      })
      .where(eq(plans.id, existingPlan.id));
  } else if (status === "canceled" || status === "unpaid") {
    await db
      .update(plans)
      .set({
        stripeSubscriptionId: null,
        stripeProductId: null,
        name: PLANS.basic.name,
        subscriptionStatus: status,
      })
      .where(eq(plans.id, existingPlan.id));
  }
}
