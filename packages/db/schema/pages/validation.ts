import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { DocumentContent } from "@mapform/blocknote";
import { z } from "zod";
import { pages } from "./schema";

const styleTextSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  styles: z.record(z.string(), z.string()),
});

const linkSchema = z.object({
  type: z.literal("link"),
  href: z.string(),
  content: styleTextSchema.array(),
});

const baseBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  content: z.union([styleTextSchema, linkSchema]).array().optional(),
});

type Block = z.infer<typeof baseBlockSchema> & {
  children: Block[];
};

const blockSchema: z.ZodType<Block> = baseBlockSchema.extend({
  children: z.lazy(() => blockSchema.array()),
});

export const insertPageSchema = createInsertSchema(pages, {
  position: z.number().int().gt(0),
  center: z.object({
    x: z.number(),
    y: z.number(),
  }),
  content: z.object({
    content: z.record(z.string(), z.string()).array(),
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

export type Page = Modify<
  z.infer<typeof selectPageSchema>,
  {
    content?: {
      content: DocumentContent;
    };
  }
>;

type Modify<T, R> = Omit<T, keyof R> & R;
