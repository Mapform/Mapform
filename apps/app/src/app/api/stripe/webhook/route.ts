import type Stripe from "stripe";

import { db } from "@mapform/db";
import { plans } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { stripe } from "@mapform/lib/stripe";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PLANS } from "@mapform/lib/constants/plans";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object;
      await handleSubscriptionChange(subscription);

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
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
        stripePriceId: plan?.id,
        name: (plan?.product as Stripe.Product).name,
        // TODO: When adding more plans will need to update this
        rowLimit: PLANS.pro.rowLimit,
        storageLimit: PLANS.pro.storageLimit,
        dailyAiTokenLimit: PLANS.pro.dailyAiTokenLimit,
        subscriptionStatus: status,
      })
      .where(eq(plans.id, existingPlan.id));
  } else if (status === "canceled" || status === "unpaid") {
    await db
      .update(plans)
      .set({
        stripeSubscriptionId: null,
        stripeProductId: null,
        stripePriceId: null,
        rowLimit: PLANS.basic.rowLimit,
        name: PLANS.basic.name,
        storageLimit: PLANS.basic.storageLimit,
        dailyAiTokenLimit: PLANS.basic.dailyAiTokenLimit,
        subscriptionStatus: status,
      })
      .where(eq(plans.id, existingPlan.id));
  }
}
