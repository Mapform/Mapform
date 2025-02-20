import { relations } from "drizzle-orm";
import { workspaces } from "../workspaces/schema";
import { plans } from "./schema";

export const plansRelations = relations(plans, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [plans.workspaceSlug],
    references: [workspaces.slug],
  }),
}));
