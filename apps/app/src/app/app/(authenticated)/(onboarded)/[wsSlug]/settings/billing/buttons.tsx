"use client";

import { Button } from "@mapform/ui/components/button";
import { createCheckoutSessionAction } from "~/data/stripe/create-checkout-session";
import { createBillingSessionAction } from "~/data/stripe/create-billing-session";

export const Buttons = ({
  stripeCustomerId,
  workspaceSlug,
  stripeProductId,
}: {
  stripeCustomerId: string;
  workspaceSlug: string;
  stripeProductId: string;
}) => {
  if (true) {
    return (
      <Button
        onClick={() => {
          void createBillingSessionAction({
            workspaceSlug,
            stripeCustomerId,
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
          stripeCustomerId,
          priceId: "price_1QZZizDY79ilcWialnPP9l2u",
        });
      }}
    >
      Upgrade
    </Button>
  );
};
