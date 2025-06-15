import { relations } from "drizzle-orm";
import { workspaceMemberships } from "../workspace-memberships/schema";
import { teamspaceMemberships } from "../teamspace-memberships/schema";
import { users } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  workspaceMemberships: many(workspaceMemberships),
  teamspaceMemberships: many(teamspaceMemberships),
}));
