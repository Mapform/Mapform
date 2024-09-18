import { relations } from "drizzle-orm";
import { primaryKey, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "../users";
import { teamspaces } from "../teamspaces";

export const teamspaceMemberships = pgTable(
  "teamspace_membership",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    teamspaceId: text("teamspace_id")
      .notNull()
      .references(() => teamspaces.id),
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
