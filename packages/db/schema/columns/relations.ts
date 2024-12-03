import { relations } from "drizzle-orm";
import { cells } from "../cells/schema";
import { datasets } from "../datasets/schema";
import { pointLayers } from "../layers/schema";
import { pages } from "../pages/schema";
import { columns } from "./schema";

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
