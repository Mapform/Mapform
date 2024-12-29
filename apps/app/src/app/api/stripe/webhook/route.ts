import Stripe from "stripe";

import { db } from "@mapform/db";
import { plans } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { stripe } from "@mapform/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
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

  console.log(22222, event);

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

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
        stripePriceId: plan?.id,
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
        stripePriceId: null,
        name: PLANS.basic.name,
        subscriptionStatus: status,
      })
      .where(eq(plans.id, existingPlan.id));
  }
}
