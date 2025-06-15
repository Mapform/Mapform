import { pgTable, pgEnum, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "../users/schema";
import { workspaces } from "../workspaces/schema";

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
  (t) => [primaryKey({ columns: [t.userId, t.workspaceId] })],
);
