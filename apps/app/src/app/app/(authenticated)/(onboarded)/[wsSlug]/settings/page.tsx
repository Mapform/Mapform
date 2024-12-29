import { Usage } from "./usage";
import { authClient } from "~/lib/safe-action";
import { WorkspaceSettings } from "./workspace-settings";
import { notFound } from "next/navigation";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { Billing } from "./billing";
import { getStripePrices, getStripeProducts } from "@mapform/lib/stripe";
import { env } from "~/*";

async function fetchRowAndPageCount(workspaceSlug: string) {
  const response = await authClient.getRowAndPageCount({ workspaceSlug });
  const rowCount = response?.data?.rowCount;
  const pageCount = response?.data?.pageCount;

  if (rowCount === undefined || pageCount === undefined) {
    return notFound();
  }

  return rowCount + pageCount;
}

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
  const [stripePrices, stripeProducts, workspacePlan, rowsUsed] =
    await Promise.all([
      getStripePrices(),
      getStripeProducts(),
      fetchWorkspacePlan(params.wsSlug),
      fetchRowAndPageCount(params.wsSlug),
    ]);

  const proPlan = stripeProducts.find(
    (product) => product.id === env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
  );
  const proPrice = stripePrices.find(
    (price) => price.productId === proPlan?.id,
  );

  if (!proPrice) {
    throw new Error("Pro price not found");
  }

  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
        <Billing
          plan={workspacePlan}
          proPrice={proPrice}
          workspaceSlug={params.wsSlug}
        />
        <Usage rowsUsed={rowsUsed} />
        <WorkspaceSettings />
      </div>
    </div>
  );
}
