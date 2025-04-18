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
  varchar,
  customType,
} from "drizzle-orm/pg-core";
import type { DocumentContent } from "@mapform/blocknote";
import { rows } from "../rows/schema";
import { columns } from "../columns/schema";

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
  (t) => [
    index("point_spatial_index").using("gist", t.value),
    unique("point_cell_unq").on(t.cellId),
  ],
);

// Custom type for line geometry
const lineGeometry = customType<{ data: string }>({
  dataType() {
    return "geometry(LineString, 4326)";
  },
});

/**
 * LINE CELL
 */
export const lineCells = pgTable(
  "line_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: lineGeometry("value"),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("line_spatial_index").using("gist", t.value),
    unique("line_cell_unq").on(t.cellId),
  ],
);

// Custom type for polygon geometry
const polygonGeometry = customType<{ data: string }>({
  dataType() {
    return "geometry(Polygon, 4326)";
  },
});

/**
 * POLYGON CELL
 */
export const polygonCells = pgTable(
  "polygon_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: polygonGeometry("value"),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("polygon_spatial_index").using("gist", t.value),
    unique("polygon_cell_unq").on(t.cellId),
  ],
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

/**
 * RICHTEXT CELL
 */
export const richtextCells = pgTable(
  "richtext_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: jsonb("value").$type<{ content: DocumentContent }>(),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => [unique("richtext_cell_unq").on(t.cellId)],
);

/**
 * ICON CELL
 */
export const iconsCells = pgTable(
  "icon_cell",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    value: varchar("icon", { length: 256 }),

    cellId: uuid("cell_id")
      .notNull()
      .references(() => cells.id, { onDelete: "cascade" }),
  },
  (t) => [unique("icon_cell_unq").on(t.cellId)],
);
