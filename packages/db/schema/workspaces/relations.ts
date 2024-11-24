import { relations } from "drizzle-orm";
import { workspaceMemberships } from "../workspace-memberships/schema";
import { teamspaces } from "../teamspaces/schema";
import { workspaces } from "./schema";

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  workspaceMemberships: many(workspaceMemberships),
  teamspaces: many(teamspaces),
}));
