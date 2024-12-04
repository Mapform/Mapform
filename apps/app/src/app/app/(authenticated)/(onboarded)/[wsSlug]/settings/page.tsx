import { Usage } from "./usage";
import { WorkspaceSettings } from "./workspace-settings";

export default function Settings() {
  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-lg gap-y-12 divide-y">
        <Usage />
        <WorkspaceSettings />
      </div>
    </div>
  );
}
