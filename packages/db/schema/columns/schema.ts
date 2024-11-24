import {
  timestamp,
  pgTable,
  uuid,
  text,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { datasets } from "../datasets/schema";
import { pages } from "../pages/schema";

export const columnTypeEnum = pgEnum("column_type", [
  "string",
  "bool",
  "number",
  "date",
  "point",
  "richtext",
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
  (t) => [unique().on(t.datasetId, t.name)],
);
