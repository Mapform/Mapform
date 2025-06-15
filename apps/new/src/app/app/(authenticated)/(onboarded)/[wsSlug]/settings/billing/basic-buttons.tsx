"use client";

import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { Button } from "@mapform/ui/components/button";
import { env } from "~/*";
import { createCheckoutSessionAction } from "~/data/stripe/create-checkout-session";
import { createBillingSessionAction } from "~/data/stripe/create-billing-session";

export const BasicButtons = ({
  plan,
  workspaceSlug,
}: {
  plan: NonNullable<NonNullable<WorkspaceDirectory["data"]>["plan"]>;
  workspaceSlug: string;
}) => {
  const stripeProductId = plan.stripeProductId;

  if (stripeProductId) {
    return (
      <Button
        onClick={() => {
          void createBillingSessionAction({
            workspaceSlug,
            stripeCustomerId: plan.stripeCustomerId,
            stripeProductId,
          });
        }}
        variant="outline"
      >
        Downgrade
      </Button>
    );
  }

  return (
    <Button
      disabled
      onClick={() => {
        void createCheckoutSessionAction({
          workspaceSlug,
          stripeCustomerId: plan.stripeCustomerId,
          priceId: env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY,
        });
      }}
      size="sm"
      variant="secondary"
    >
      Current Plan
    </Button>
  );
};
