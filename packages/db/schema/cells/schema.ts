import {
  timestamp,
  pgTable,
  uuid,
  text,
  pgEnum,
  unique,
  boolean,
  numeric,
  geometry,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rows } from "../rows";
import { columns } from "../columns";

/**
 * PARENT CELL
 */
export const cells = pgTable(
  "cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    rowId: uuid("row_id")
      .notNull()
      .references(() => rows.id, { onDelete: "cascade" }),
    columnId: uuid("column_id")
      .notNull()
      .references(() => columns.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => ({
    unq: unique().on(t.rowId, t.columnId),
  })
);

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
}));

/**
 * STRING CELL
 */
export const stringCells = pgTable("string_cell", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: text("value").notNull(),

  cellId: uuid("cell_id")
    .notNull()
    .references(() => cells.id, { onDelete: "cascade" }),
});

export const stringCellsRelations = relations(stringCells, ({ one }) => ({
  cell: one(cells, {
    fields: [stringCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * NUMBER CELL
 */
export const numberCells = pgTable("number_cell", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: numeric("value").notNull(),

  cellId: uuid("cell_id")
    .notNull()
    .references(() => cells.id, { onDelete: "cascade" }),
});

export const numberCellsRelations = relations(numberCells, ({ one }) => ({
  cell: one(cells, {
    fields: [numberCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * BOOLEAN CELL
 */
export const booleanCells = pgTable("boolean_cell", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: boolean("value").notNull(),

  cellId: uuid("cell_id")
    .notNull()
    .references(() => cells.id, { onDelete: "cascade" }),
});

export const booleanCellsRelations = relations(booleanCells, ({ one }) => ({
  cell: one(cells, {
    fields: [booleanCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * POINT CELL
 */
export const pointCells = pgTable("point_cell", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: geometry("value", { type: "point", mode: "xy" }).notNull(),

  cellId: uuid("cell_id")
    .notNull()
    .references(() => cells.id, { onDelete: "cascade" }),
});

export const pointCellsRelations = relations(pointCells, ({ one }) => ({
  cell: one(cells, {
    fields: [pointCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * DATE CELL
 */
export const dateCells = pgTable("date_cell", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: timestamp("value", { withTimezone: true }).notNull(),

  cellId: uuid("cell_id")
    .notNull()
    .references(() => cells.id, { onDelete: "cascade" }),
});

export const dateCellsRelations = relations(dateCells, ({ one }) => ({
  cell: one(cells, {
    fields: [dateCells.cellId],
    references: [cells.id],
  }),
}));