import { relations } from "drizzle-orm";
import { users } from "../users/schema";
import { workspaces } from "../workspaces/schema";
import { workspaceMemberships } from "./schema";

export const workspaceMembershipsRelations = relations(
  workspaceMemberships,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMemberships.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMemberships.userId],
      references: [users.id],
    }),
  }),
);
