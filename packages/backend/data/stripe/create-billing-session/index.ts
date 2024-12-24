"server-only";

import { createBillingSessionSchema } from "./schema";
import Stripe from "stripe";
import { env } from "../../../env.mjs";
import type { UserAuthClient, UnwrapReturn } from "../../../lib/types";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createBillingSession = (authClient: UserAuthClient) =>
  authClient
    .schema(createBillingSessionSchema)
    .action(
      async ({
        parsedInput: { stripeCustomerId, stripeProductId, workspaceSlug },
        ctx: { userAccess },
      }) => {
        if (!userAccess.workspace.checkAccessBySlug(workspaceSlug)) {
          throw new Error("Unauthorized");
        }

        let configuration: Stripe.BillingPortal.Configuration;
        const configurations = await stripe.billingPortal.configurations.list();

        if (configurations.data.length > 0) {
          configuration = configurations.data[0]!;
        } else {
          const product = await stripe.products.retrieve(stripeProductId);

          if (!product.active) {
            throw new Error("Workspaces's product is not active in Stripe");
          }

          const prices = await stripe.prices.list({
            product: product.id,
            active: true,
          });

          if (prices.data.length === 0) {
            throw new Error(
              "No active prices found for the workspace's product",
            );
          }

          configuration = await stripe.billingPortal.configurations.create({
            business_profile: {
              headline: "Manage your subscription",
            },
            features: {
              subscription_update: {
                enabled: true,
                default_allowed_updates: [
                  "price",
                  "quantity",
                  "promotion_code",
                ],
                proration_behavior: "create_prorations",
                products: [
                  {
                    product: product.id,
                    prices: prices.data.map((price) => price.id),
                  },
                ],
              },
              subscription_cancel: {
                enabled: true,
                mode: "at_period_end",
                cancellation_reason: {
                  enabled: true,
                  options: [
                    "too_expensive",
                    "missing_features",
                    "switched_service",
                    "unused",
                    "other",
                  ],
                },
              },
            },
          });
        }

        return stripe.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: `${env.NEXT_PUBLIC_BASE_URL}/app/${workspaceSlug}/settings`,
          configuration: configuration.id,
        });
      },
    );

export type CreateBillingSession = UnwrapReturn<typeof createBillingSession>;
