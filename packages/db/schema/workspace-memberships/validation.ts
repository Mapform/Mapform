import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { workspaceMemberships } from "./schema";

export const insertWorkspaceMembershipSchema =
  createInsertSchema(workspaceMemberships);

export const selectWorkspaceMembershipSchema =
  createSelectSchema(workspaceMemberships);

export type InsertWorkspaceMembership = z.infer<
  typeof insertWorkspaceMembershipSchema
>;
export type WorkspaceMembership = z.infer<
  typeof selectWorkspaceMembershipSchema
>;
