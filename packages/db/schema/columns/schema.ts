import {
  timestamp,
  pgTable,
  uuid,
  text,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { datasets } from "../datasets";
import { pages } from "../pages";
import { pointLayers } from "../layers";
import { cells } from "../cells";

export const columnTypeEnum = pgEnum("column_type", [
  "string",
  "bool",
  "number",
  "date",
  "point",
]);

export const columns = pgTable(
  "column",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: columnTypeEnum("type").notNull(),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),

    // These fields are only used when the dataset belongs to a form
    blockNoteId: text("block_note_id").unique(),
    pageId: uuid("page_id").references(() => pages.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => ({
    unq: unique().on(t.datasetId, t.name),
  })
);

export const columnsRelations = relations(columns, ({ one, many }) => ({
  dataset: one(datasets, {
    fields: [columns.datasetId],
    references: [datasets.id],
  }),
  page: one(pages, {
    fields: [columns.pageId],
    references: [pages.id],
  }),
  pointLayers: many(pointLayers),
  cells: many(cells),
}));
