import { relations } from "drizzle-orm";
import { teamspaces } from "../teamspaces/schema";
import { users } from "../users/schema";
import { teamspaceMemberships } from "./schema";

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
  }),
);
