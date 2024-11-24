import { pgTable, pgEnum, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "../users/schema";
import { teamspaces } from "../teamspaces/schema";

export const teamspaceRoleEnum = pgEnum("teamspace_role", ["owner", "member"]);

export const teamspaceMemberships = pgTable(
  "teamspace_membership",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teamspaceId: uuid("teamspace_id")
      .notNull()
      .references(() => teamspaces.id, { onDelete: "cascade" }),
    role: teamspaceRoleEnum("teamspace_role").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.teamspaceId] })],
);
