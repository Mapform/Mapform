import { notFound } from "next/navigation";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { getStripePrices, getStripeProducts } from "@mapform/lib/stripe";
import { env } from "~/*";
import { Badge } from "@mapform/ui/components/badge";

const BASIC_FEATURES = [
  "Unlimited projects",
  "Unlimited datasets",
  "100 rows",
  "10 MB storage",
];

const PRO_FEATURES = [
  "Everything in Basic",
  "Collect data with Forms",
  "1,000 rows",
  "100 MB storage",
];

async function fetchWorkspacePlan(workspaceSlug: string) {
  const response = await getWorkspaceDirectory({ slug: workspaceSlug });
  const workspacePlan = response?.data?.plan;

  if (!workspacePlan) {
    return notFound();
  }

  return workspacePlan;
}

export default async function BillingPage(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const [stripePrices, stripeProducts, workspacePlan] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
    fetchWorkspacePlan(params.wsSlug),
  ]);

  const proPlan = stripeProducts.find(
    (product: { id: string }) =>
      product.id === env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
  );
  const proPrice = stripePrices.find(
    (price: { productId: string }) => price.productId === proPlan?.id,
  );

  if (!proPrice) {
    throw new Error("Pro price not found");
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="pb-8">
        <div className="text-muted-foreground text-sm">
          Your current plan is <Badge>{workspacePlan.name}</Badge>
        </div>
      </div>
      <div className="@4xl:col-span-2 grid-cols-1 space-y-6">
        {/* <div className="grid grid-cols-2">
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
                <div className="text-2xl font-medium">$6</div>
                <div className="text-muted-foreground mb-[3px] ml-1 self-end text-sm">
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
          </div> */}
      </div>
    </div>
  );
}
