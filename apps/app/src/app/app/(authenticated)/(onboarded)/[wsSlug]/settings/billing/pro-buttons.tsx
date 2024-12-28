"use client";

import { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { Button } from "@mapform/ui/components/button";
import { env } from "~/*";
import { createCheckoutSessionAction } from "~/data/stripe/create-checkout-session";
// import { createBillingSessionAction } from "~/data/stripe/create-billing-session";

export const ProButtons = ({
  plan,
  workspaceSlug,
  // stripeProductId,
}: {
  plan: NonNullable<NonNullable<WorkspaceDirectory["data"]>["plan"]>;
  workspaceSlug: string;
  // stripeProductId: string;
}) => {
  // if (true) {
  //   return (
  //     <Button
  //       onClick={() => {
  //         void createBillingSessionAction({
  //           workspaceSlug,
  //           stripeCustomerId,
  //           stripeProductId,
  //         });
  //       }}
  //       variant="outline"
  //     >
  //       Manage
  //     </Button>
  //   );
  // }

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
