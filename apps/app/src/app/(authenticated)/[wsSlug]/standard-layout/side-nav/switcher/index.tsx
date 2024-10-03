import { getCurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import { SwitcherPopover } from "./popover";

export async function Switcher({ workspaceSlug }: { workspaceSlug?: string }) {
  const workspaceMembershipsResponse =
    await getCurrentUserWorkspaceMemberships();
  const workspaceMemberships = workspaceMembershipsResponse?.data;

  return (
    <SwitcherPopover
      workspaceSlug={workspaceSlug}
      workspaceMemberships={workspaceMemberships}
    />
  );
}
