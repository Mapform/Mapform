"server-only";

import { getCurrentUserWorkspaceMemberships } from "@mapform/backend/workspace-memberships/get-current-user-workspace-memberships";
import { authAction } from "~/lib/safe-action";

export const getCurrentUserWorkspaceMembershipsAction = authAction.action(
  ({ ctx: { user } }) => {
    return getCurrentUserWorkspaceMemberships({ userId: user.id });
  },
);
