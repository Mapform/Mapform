import { relations } from "drizzle-orm";
import { layers } from "../layers/schema";
import { pages } from "../pages/schema";
import { layersToPages } from "./schema";

export const layersToPagesRelations = relations(layersToPages, ({ one }) => ({
  layer: one(layers, {
    fields: [layersToPages.layerId],
    references: [layers.id],
  }),
  page: one(pages, {
    fields: [layersToPages.pageId],
    references: [pages.id],
  }),
}));
