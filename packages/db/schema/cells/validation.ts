import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  cells,
  dateCells,
  pointCells,
  numberCells,
  stringCells,
  booleanCells,
  richtextCells,
} from "./schema";
import { blockSchema } from "../blocks/validation";
import type { DocumentContent } from "@mapform/blocknote";

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
export const insertPointCellSchema = createInsertSchema(pointCells);
export const selectPointCellSchema = createSelectSchema(pointCells);
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
