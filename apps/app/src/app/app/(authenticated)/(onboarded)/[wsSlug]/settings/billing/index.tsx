import { Badge } from "@mapform/ui/components/badge";
import { ProButtons } from "./pro-buttons";
import { PLANS } from "@mapform/lib/constants/plans";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { BasicButtons } from "./basic-buttons";
import { getStripePrices } from "@mapform/lib/stripe";

const BASIC_FEATURES = ["Unlimited projects", "Unlimited datasets", "100 rows"];

const PRO_FEATURES = [
  "Everything in Basic",
  "Teams (coming soon)",
  "1,000 rows",
];

export function Billing({
  plan,
  workspaceSlug,
}: {
  plan: NonNullable<NonNullable<WorkspaceDirectory["data"]>["plan"]>;
  workspaceSlug: string;
  proPrice: Awaited<ReturnType<typeof getStripePrices>>[number];
}) {
  return (
    <div className="flex flex-col pb-12">
      <div className="@4xl:grid-cols-3 grid grid-cols-1 gap-x-8">
        <div className="pb-8">
          <h2 className="text-md font-semibold">Active Plan</h2>
          <span className="text-muted-foreground mt-1 text-sm">
            Your current plan is <Badge>{plan.name}</Badge>
          </span>
        </div>
        <div className="@4xl:col-span-2 grid-cols-1 space-y-6">
          <div className="grid grid-cols-2">
            <div className="">
              <div className="text-sm font-semibold">{PLANS.basic.name}</div>
              <div className="mb-2 text-2xl font-medium">$0</div>
              <BasicButtons plan={plan} workspaceSlug={workspaceSlug} />
              <ul className="mt-2 text-sm">
                {BASIC_FEATURES.map((feature) => (
                  <li
                    className="rounded-l-md px-3 py-2 even:bg-gray-50"
                    key={feature}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="">
              <div className="text-sm font-semibold">{PLANS.pro.name}</div>
              <div className="mb-2 flex">
                <div className="text-2xl font-medium">$12</div>
                <div className="text-muted-foreground mb-[3px] ml-1 self-end text-sm">
                  {/* TODO: Add this back once introducing seats. Also need to allow seat modifications in Stripe Billing > Customer Portal: https://dashboard.stripe.com/test/settings/billing/portal */}
                  {/* per seat/month */}
                  per month
                </div>
              </div>
              <ProButtons plan={plan} workspaceSlug={workspaceSlug} />
              <ul className="mt-2 text-sm">
                {PRO_FEATURES.map((feature) => (
                  <li
                    className="rounded-r-md px-3 py-2 even:bg-gray-50"
                    key={feature}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
