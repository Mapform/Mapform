"server-only";

import { createCheckoutSessionSchema } from "./schema";
import Stripe from "stripe";
import { env } from "../../../env.mjs";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createCheckoutSession = (authClient: UserAuthClient) =>
  authClient
    .inputSchema(createCheckoutSessionSchema)
    .action(
      async ({
        parsedInput: { stripeCustomerId, workspaceSlug, priceId },
        ctx: { userAccess },
      }) => {
        if (!userAccess.workspace.checkAccessBySlug(workspaceSlug)) {
          throw new Error("Unauthorized");
        }

        // TODO: Once members can be added, must ensure that only the owner can create a checkout session
        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${env.NEXT_PUBLIC_BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/app/${workspaceSlug}/settings`,
          customer: stripeCustomerId || undefined,
          client_reference_id: workspaceSlug,
          allow_promotion_codes: true,
        });
      },
    );

export type CreateCheckoutSession = UnwrapReturn<typeof createCheckoutSession>;
