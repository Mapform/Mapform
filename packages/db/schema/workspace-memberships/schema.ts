import { relations } from "drizzle-orm";
import { pgEnum, primaryKey, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "../users";
import { workspaces } from "../workspaces";

export const workspaceRoleEnum = pgEnum("workspace_role", ["owner", "member"]);

export const workspaceMemberships = pgTable(
  "workspace_membership",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("workspace_role").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.workspaceId] }),
  }),
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
  }),
);
