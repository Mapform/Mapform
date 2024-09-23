import { timestamp, pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { datasets } from "../datasets";
import { submissions } from "../submissions/schema";

export const rows = pgTable("row", {
  id: uuid("id").primaryKey().defaultRandom(),
  datasetId: uuid("dataset_id")
    .notNull()
    .references(() => datasets.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const rowsRelations = relations(rows, ({ one }) => ({
  submission: one(submissions),
  dataset: one(datasets, {
    fields: [rows.datasetId],
    references: [datasets.id],
  }),
}));
