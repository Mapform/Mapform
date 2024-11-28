import emojiRegex from "emoji-regex";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import type { DocumentContent } from "@mapform/blocknote";
import { blockSchema } from "../blocks/validation";
import {
  cells,
  dateCells,
  pointCells,
  numberCells,
  stringCells,
  booleanCells,
  richtextCells,
  iconsCells,
} from "./schema";

/**
 * CELLS
 */
export const insertCellSchema = createInsertSchema(cells);
export const selectCellSchema = createSelectSchema(cells);
export type InsertCell = z.infer<typeof insertCellSchema>;
export type Cell = typeof cells.$inferSelect;

/**
 * POINT CELLS
 */
export const insertPointCellSchema = createInsertSchema(pointCells, {
  value: z.object({
    x: z.number(),
    y: z.number(),
  }),
});
export const selectPointCellSchema = createSelectSchema(pointCells, {
  value: z.object({
    x: z.number(),
    y: z.number(),
  }),
});
export type InsertPointCell = z.infer<typeof insertPointCellSchema>;
export type PointCell = typeof pointCells.$inferSelect;

/**
 * DATE CELLS
 */
export const insertDateCellSchema = createInsertSchema(dateCells);
export const selectDateCellSchema = createSelectSchema(dateCells);
export type InsertDateCell = z.infer<typeof insertDateCellSchema>;
export type DateCell = typeof dateCells.$inferSelect;

/**
 * NUMBER CELLS
 */
export const insertNumberCellSchema = createInsertSchema(numberCells);
export const selectNumberCellSchema = createSelectSchema(numberCells);
export type InsertNumberCell = z.infer<typeof insertNumberCellSchema>;
export type NumberCell = typeof numberCells.$inferSelect;

/**
 * STRING CELLS
 */
export const insertStringCellSchema = createInsertSchema(stringCells);
export const selectStringCellSchema = createSelectSchema(stringCells);
export type InsertStringCell = z.infer<typeof insertStringCellSchema>;
export type StringCell = typeof stringCells.$inferSelect;

/**
 * BOOLEAN CELLS
 */
export const insertBooleanCellSchema = createInsertSchema(booleanCells);
export const selectBooleanCellSchema = createSelectSchema(booleanCells);
export type InsertBooleanCell = z.infer<typeof insertBooleanCellSchema>;
export type BooleanCell = typeof booleanCells.$inferSelect;

/**
 * ICON CELLS
 */
export const insertIconCellSchema = createInsertSchema(iconsCells, {
  value: z
    .string()
    .min(1, "Emoji is required")
    .max(2, "Only a single emoji is allowed") // Emojis might be more than one character in length
    .refine((value) => emojiRegex().test(value), {
      message: "Must be a single emoji",
    }),
});
export const selectIconCellSchema = createSelectSchema(iconsCells, {
  value: z.string().superRefine((val, ctx) => {
    const matchedEmojiCount = (val.match(emojiRegex()) || []).length;

    if (matchedEmojiCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be a single emoji",
      });
    }
  }),
});
export type InsertIconCell = z.infer<typeof insertIconCellSchema>;
export type IconCell = typeof iconsCells.$inferSelect;

/**
 * RICHTEXT CELLS
 */
export const insertRichtextCellSchema = createInsertSchema(richtextCells, {
  value: z.object({
    content: blockSchema.array(),
  }),
});
export const selectRichtextCellSchema = createSelectSchema(richtextCells, {
  value: z.object({
    content: blockSchema.array(),
  }),
});
export type InsertRichtextCell = Modify<
  z.infer<typeof insertRichtextCellSchema>,
  {
    content?: {
      content: DocumentContent;
    };
  }
>;
export type RichtextCell = typeof richtextCells.$inferSelect;

type Modify<T, R> = Omit<T, keyof R> & R;
