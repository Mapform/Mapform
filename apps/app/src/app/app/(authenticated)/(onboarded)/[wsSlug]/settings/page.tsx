import { countWorkspaceRowsAction } from "~/data/rows/count-workspace-rows";
import { Usage } from "./usage";
import { WorkspaceSettings } from "./workspace-settings";

export default async function Settings() {
  const response = await countWorkspaceRowsAction();

  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-lg gap-y-12 divide-y">
        <Usage rowsUsed={response?.data || 0} />
        <WorkspaceSettings />
      </div>
    </div>
  );
}
