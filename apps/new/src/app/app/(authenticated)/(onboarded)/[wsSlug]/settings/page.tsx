import { notFound } from "next/navigation";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { getStripePrices, getStripeProducts } from "@mapform/lib/stripe";
import { env } from "~/*";
import { WorkspaceSettings } from "./workspace-settings";

async function fetchWorkspacePlan(workspaceSlug: string) {
  const response = await getWorkspaceDirectory({ slug: workspaceSlug });
  const workspacePlan = response?.data?.plan;

  if (!workspacePlan) {
    return notFound();
  }

  return workspacePlan;
}

export default async function Settings(props: {
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

  return <WorkspaceSettings />;
}

{
  /* <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
<Billing
  plan={workspacePlan}
  proPrice={proPrice}
  workspaceSlug={params.wsSlug}
/>
<Usage
  rowLimit={workspacePlan.rowLimit}
  rowsUsed={rowsUsed}
  storageLimit={workspacePlan.storageLimit}
  storageUsed={storageUsed}
/>
<WorkspaceSettings />
</div> */
}
