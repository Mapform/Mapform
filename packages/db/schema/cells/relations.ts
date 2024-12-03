import { relations } from "drizzle-orm";
import { rows } from "../rows/schema";
import { columns } from "../columns/schema";
import {
  cells,
  stringCells,
  numberCells,
  booleanCells,
  pointCells,
  dateCells,
  richtextCells,
  iconsCells,
} from "./schema";

/**
 * PARENT CELL
 */
export const cellsRelations = relations(cells, ({ one }) => ({
  row: one(rows, {
    fields: [cells.rowId],
    references: [rows.id],
  }),
  column: one(columns, {
    fields: [cells.columnId],
    references: [columns.id],
  }),
  stringCell: one(stringCells),
  numberCell: one(numberCells),
  booleanCell: one(booleanCells),
  pointCell: one(pointCells),
  dateCell: one(dateCells),
  richtextCell: one(richtextCells),
  iconCell: one(iconsCells),
}));

/**
 * STRING CELL
 */
export const stringCellsRelations = relations(stringCells, ({ one }) => ({
  cell: one(cells, {
    fields: [stringCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * NUMBER CELL
 */
export const numberCellsRelations = relations(numberCells, ({ one }) => ({
  cell: one(cells, {
    fields: [numberCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * BOOLEAN CELL
 */
export const booleanCellsRelations = relations(booleanCells, ({ one }) => ({
  cell: one(cells, {
    fields: [booleanCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * POINT CELL
 */
export const pointCellsRelations = relations(pointCells, ({ one }) => ({
  cell: one(cells, {
    fields: [pointCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * DATE CELL
 */
export const dateCellsRelations = relations(dateCells, ({ one }) => ({
  cell: one(cells, {
    fields: [dateCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * RICHTEXT CELL
 */
export const richtextCellsRelations = relations(richtextCells, ({ one }) => ({
  cell: one(cells, {
    fields: [richtextCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * ICON CELL
 */
export const iconCellsRelations = relations(iconsCells, ({ one }) => ({
  cell: one(cells, {
    fields: [iconsCells.cellId],
    references: [cells.id],
  }),
}));
