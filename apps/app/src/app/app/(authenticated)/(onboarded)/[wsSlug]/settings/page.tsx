import { Usage } from "./usage";
import { authClient } from "~/lib/safe-action";
import { WorkspaceSettings } from "./workspace-settings";
import { notFound } from "next/navigation";

export default async function Settings(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const response = await authClient.countWorkspaceRows({
    workspaceSlug: params.wsSlug,
  });

  if (!response?.data) {
    return notFound();
  }

  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
        <Usage rowsUsed={response?.data || 0} />
        <WorkspaceSettings />
      </div>
    </div>
  );
}
