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

async function fetchStorageUsage(workspaceSlug: string) {
  const response = await authClient.getStorageUsage({ workspaceSlug });
  const totalStorageBytes = response?.data?.totalStorageBytes;

  if (totalStorageBytes === undefined) {
    return notFound();
  }

  return totalStorageBytes;
}

export default async function Settings(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const [stripePrices, stripeProducts, workspacePlan, rowsUsed, storageUsed] =
    await Promise.all([
      getStripePrices(),
      getStripeProducts(),
      fetchWorkspacePlan(params.wsSlug),
      fetchRowAndPageCount(params.wsSlug),
      fetchStorageUsage(params.wsSlug),
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
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
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
      </div>
    </div>
  );
}
