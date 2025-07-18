import { Usage } from "./usage";
import { authClient } from "~/lib/safe-action";
import { WorkspaceSettings } from "./workspace-settings";
import { notFound } from "next/navigation";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { Billing } from "./billing";
import { getStripePrices, getStripeProducts } from "@mapform/lib/stripe";
import { env } from "~/*";
import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@mapform/ui/components/tabs";

async function fetchRowAndPageCount(workspaceSlug: string) {
  const response = await authClient.getRowCount({ workspaceSlug });
  const rowCount = response?.data;

  if (rowCount === undefined) {
    return notFound();
  }

  return rowCount;
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
    <MapDrawer initialOpen open>
      <div className="p-2">
        <Tabs className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="workspace">
              Workspace
            </TabsTrigger>
            <TabsTrigger className="w-full" value="usage">
              Usage
            </TabsTrigger>
            <TabsTrigger className="w-full" value="billing">
              Billing
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="px-6 pb-6"></div>
      {/* <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
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
      </div> */}
    </MapDrawer>
  );
}
