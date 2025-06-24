import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import { users } from "./schema";

export const insertUserSchema = createInsertSchema(users);

export const selectUserSchema = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
