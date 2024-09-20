import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { pages } from "./schema";

export const insertPageSchema = createInsertSchema(pages);

export const selectPageSchema = createSelectSchema(pages, {
  position: z.number().int().gt(0),
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = z.infer<typeof selectPageSchema>;
