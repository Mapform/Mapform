import {
  timestamp,
  pgTable,
  uuid,
  text,
  jsonb,
  unique,
  boolean,
  numeric,
  geometry,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { rows } from "../rows";
import { columns } from "../columns";
import { DocumentContent } from "@mapform/blocknote";

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
  }),
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
  richtextCell: one(richtextCells),
}));

/**
 * STRING CELL
 */
export const stringCells = pgTable(
  "string_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: text("value"),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique("string_cell_unq").on(t.cellId),
  }),
);

export const stringCellsRelations = relations(stringCells, ({ one }) => ({
  cell: one(cells, {
    fields: [stringCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * NUMBER CELL
 */
export const numberCells = pgTable(
  "number_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: numeric("value"),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique("number_cell_unq").on(t.cellId),
  }),
);

export const numberCellsRelations = relations(numberCells, ({ one }) => ({
  cell: one(cells, {
    fields: [numberCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * BOOLEAN CELL
 */
export const booleanCells = pgTable(
  "boolean_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: boolean("value"),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique("bool_cell_unq").on(t.cellId),
  }),
);

export const booleanCellsRelations = relations(booleanCells, ({ one }) => ({
  cell: one(cells, {
    fields: [booleanCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * POINT CELL
 */
export const pointCells = pgTable(
  "point_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: geometry("value", { type: "point", mode: "xy" }),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => ({
    spatialIndex: index("point_spatial_index").using("gist", t.value),
    unq: unique("point_cell_unq").on(t.cellId),
  }),
);

export const pointCellsRelations = relations(pointCells, ({ one }) => ({
  cell: one(cells, {
    fields: [pointCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * DATE CELL
 */
export const dateCells = pgTable(
  "date_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: timestamp("value", { withTimezone: true }),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique("date_cell_unq").on(t.cellId),
  }),
);

export const dateCellsRelations = relations(dateCells, ({ one }) => ({
  cell: one(cells, {
    fields: [dateCells.cellId],
    references: [cells.id],
  }),
}));

/**
 * RICHTEXT CELL
 */
export const richtextCells = pgTable(
  "richtext_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: jsonb("content").$type<{ content: DocumentContent }>(),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique("richtext_cell_unq").on(t.cellId),
  }),
);

export const richtextCellsRelations = relations(richtextCells, ({ one }) => ({
  cell: one(cells, {
    fields: [richtextCells.cellId],
    references: [cells.id],
  }),
}));
