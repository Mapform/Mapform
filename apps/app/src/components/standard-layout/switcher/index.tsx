import { getCurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import { SwitcherPopover } from "./popover";

export async function Switcher({
  currentWorkspaceSlug,
}: {
  currentWorkspaceSlug?: string;
}) {
  const workspaceMembershipsResponse =
    await getCurrentUserWorkspaceMemberships();
  const workspaceMemberships = workspaceMembershipsResponse?.data;

  return (
    <SwitcherPopover
      currentWorkspaceSlug={currentWorkspaceSlug}
      workspaceMemberships={workspaceMemberships}
    />
  );
}
