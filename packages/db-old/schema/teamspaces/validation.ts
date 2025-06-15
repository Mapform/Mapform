import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { teamspaces } from "./schema";

export const insertTeamspaceSchema = createInsertSchema(teamspaces);

export const selectTeamspaceSchema = createSelectSchema(teamspaces);

export type InsertTeamspace = z.infer<typeof insertTeamspaceSchema>;
export type Teamspace = typeof teamspaces.$inferSelect;
