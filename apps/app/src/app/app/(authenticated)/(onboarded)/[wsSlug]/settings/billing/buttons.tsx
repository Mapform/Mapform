"use client";

import { Button } from "@mapform/ui/components/button";
import { createCheckoutSessionAction } from "~/data/stripe/create-checkout-session";

export const Buttons = ({ stripeCustomerId }: { stripeCustomerId: string }) => {
  return (
    <Button
      onClick={() => {
        createCheckoutSessionAction({
          stripeCustomerId,
          priceId: "price_1QYrMPDY79ilcWiaeuOtBB8P",
        });
      }}
    >
      Upgrade
    </Button>
  );
};
