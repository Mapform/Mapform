import {
  timestamp,
  pgTable,
  uuid,
  text,
  unique,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { rows } from "../rows/schema";
import { columns } from "../columns/schema";

/**
 * PARENT CELL
 */
export const cells = pgTable(
  "cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Don't need explicit 'type' descriminator on cells before its on the
    // linked column table

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
  (t) => [unique().on(t.rowId, t.columnId)],
);

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
  (t) => [unique("string_cell_unq").on(t.cellId)],
);

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
  (t) => [unique("number_cell_unq").on(t.cellId)],
);

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
  (t) => [unique("bool_cell_unq").on(t.cellId)],
);

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
  (t) => [unique("date_cell_unq").on(t.cellId)],
);
