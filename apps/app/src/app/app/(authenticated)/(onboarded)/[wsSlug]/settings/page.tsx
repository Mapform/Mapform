import { Usage } from "./usage";
import { authClient } from "~/lib/safe-action";
import { WorkspaceSettings } from "./workspace-settings";
import { notFound } from "next/navigation";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { Billing } from "./billing";

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
  const [workspacePlan, rowsUsed] = await Promise.all([
    fetchWorkspacePlan(params.wsSlug),
    fetchRowAndPageCount(params.wsSlug),
  ]);

  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
        <Billing
          planName={workspacePlan.name}
          stripeCustomerId={workspacePlan.stripeCustomerId}
          workspaceSlug={params.wsSlug}
        />
        <Usage rowsUsed={rowsUsed} />
        <WorkspaceSettings />
      </div>
    </div>
  );
}
