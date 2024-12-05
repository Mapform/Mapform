"server-only";

// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import { countWorkspaceRows } from "@mapform/backend/rows/count-workspace-rows";
import { authAction } from "~/lib/safe-action";

export const countWorkspaceRowsAction = cache(
  authAction.action(async ({ ctx: { workspaceSlug } }) =>
    countWorkspaceRows({ workspaceSlug }),
  ),
);
