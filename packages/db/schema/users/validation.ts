import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { users, sessions } from "./schema";

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(3),
});

export const selectUserSchema = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;