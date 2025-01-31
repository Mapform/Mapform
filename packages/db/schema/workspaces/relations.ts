import { relations } from "drizzle-orm";
import { workspaceMemberships } from "../workspace-memberships/schema";
import { teamspaces } from "../teamspaces/schema";
import { workspaces } from "./schema";
import { plans } from "../plans/schema";

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  workspaceMemberships: many(workspaceMemberships),
  teamspaces: many(teamspaces),
  plan: one(plans),
}));
