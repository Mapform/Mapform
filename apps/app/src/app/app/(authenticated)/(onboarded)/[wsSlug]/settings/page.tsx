import { Usage } from "./usage";
import { authClient } from "~/lib/safe-action";
import { WorkspaceSettings } from "./workspace-settings";
import { notFound } from "next/navigation";

async function fetchRowAndPageCount(workspaceSlug: string) {
  const response = await authClient.getRowAndPageCount({ workspaceSlug });
  const rowCount = response?.data?.rowCount;
  const pageCount = response?.data?.pageCount;

  if (rowCount === undefined || pageCount === undefined) {
    return notFound();
  }

  return rowCount + pageCount;
}

export default async function Settings(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const rowsUsed = await fetchRowAndPageCount(params.wsSlug);

  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-md gap-y-12 divide-y">
        <Usage rowsUsed={rowsUsed} />
        <WorkspaceSettings />
      </div>
    </div>
  );
}
