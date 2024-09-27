import { relations } from "drizzle-orm";
import { pgEnum, primaryKey, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "../users";
import { teamspaces } from "../teamspaces";

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
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.teamspaceId] }),
  })
);

export const teamspaceMembershipsRelations = relations(
  teamspaceMemberships,
  ({ one }) => ({
    teamspace: one(teamspaces, {
      fields: [teamspaceMemberships.teamspaceId],
      references: [teamspaces.id],
    }),
    user: one(users, {
      fields: [teamspaceMemberships.userId],
      references: [users.id],
    }),
  })
);
