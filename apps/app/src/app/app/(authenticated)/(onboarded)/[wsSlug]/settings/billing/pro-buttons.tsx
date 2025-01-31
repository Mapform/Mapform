"use client";

import { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { Button } from "@mapform/ui/components/button";
import { env } from "~/*";
import { createBillingSessionAction } from "~/data/stripe/create-billing-session";
import { createCheckoutSessionAction } from "~/data/stripe/create-checkout-session";

export const ProButtons = ({
  plan,
  workspaceSlug,
}: {
  plan: NonNullable<NonNullable<WorkspaceDirectory["data"]>["plan"]>;
  workspaceSlug: string;
}) => {
  const stripeProductId = plan.stripeProductId;

  if (
    stripeProductId &&
    plan.stripeProductId === env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID
  ) {
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
        Manage
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        void createCheckoutSessionAction({
          workspaceSlug,
          stripeCustomerId: plan.stripeCustomerId,
          priceId: env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY,
        });
      }}
      size="sm"
    >
      Upgrade
    </Button>
  );
};
