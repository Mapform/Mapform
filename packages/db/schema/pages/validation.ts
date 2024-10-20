import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { DocumentContent } from "@mapform/blocknote";
import { z } from "zod";
import { pages } from "./schema";
import { blockSchema } from "../blocks/validation";

export const insertPageSchema = createInsertSchema(pages, {
  position: z.number().int().gt(0),
  center: z.object({
    x: z.number(),
    y: z.number(),
  }),
  content: z.object({
    content: blockSchema.array(),
  }),
});

export const selectPageSchema = createSelectSchema(pages, {
  position: z.number().int().gt(0),
  center: z.object({
    x: z.number(),
    y: z.number(),
  }),
  content: z.object({
    content: blockSchema.array(),
  }),
});

export type InsertPage = Modify<
  z.infer<typeof insertPageSchema>,
  {
    content?: {
      content: DocumentContent;
    };
  }
>;

export type Page = typeof pages.$inferSelect;

type Modify<T, R> = Omit<T, keyof R> & R;
