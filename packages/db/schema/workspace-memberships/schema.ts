import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import { pgTable, integer } from "drizzle-orm/pg-core";
import { users } from "../users";
import { workspaces } from "../workspaces";

export const workspaceMemberships = pgTable(
  "workspace_membership",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    workspaceId: integer("workspace_id")
      .notNull()
      .references(() => workspaces.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.workspaceId] }),
  })
);

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
  })
);
