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
  lineCells,
  polygonCells,
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
  lineCell: one(lineCells),
  polygonCell: one(polygonCells),
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
 * LINE CELL
 */
export const lineCellsRelations = relations(lineCells, ({ one }) => ({
  cell: one(cells, {
    fields: [lineCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * POLYGON CELL
 */
export const polygonCellsRelations = relations(polygonCells, ({ one }) => ({
  cell: one(cells, {
    fields: [polygonCells.cellId],
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
