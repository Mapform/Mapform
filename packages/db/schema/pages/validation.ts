import emojiRegex from "emoji-regex";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { DocumentContent } from "@mapform/blocknote";
import { z } from "zod";
import { blockSchema } from "../blocks/validation";
import { pages } from "./schema";

const schemaExtension = {
  position: z.number().int().gt(0),
  center: z.object({
    x: z.number(),
    y: z.number(),
  }),
  content: z.object({
    content: blockSchema.array(),
  }),
  icon: z
    .string()
    .min(1, "Emoji is required")
    .superRefine((val, ctx) => {
      const matchedEmojiCount = (val.match(emojiRegex()) || []).length;

      if (matchedEmojiCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be a single emoji",
        });
      }
    }),
};

export const insertPageSchema = createInsertSchema(pages, schemaExtension);
export const selectPageSchema = createSelectSchema(pages, schemaExtension);

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
