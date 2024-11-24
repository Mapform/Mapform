import { relations } from "drizzle-orm";
import { cells } from "../cells/schema";
import { datasets } from "../datasets/schema";
import { rows } from "./schema";

export const rowsRelations = relations(rows, ({ one, many }) => ({
  dataset: one(datasets, {
    fields: [rows.datasetId],
    references: [datasets.id],
  }),
  cells: many(cells),
}));
