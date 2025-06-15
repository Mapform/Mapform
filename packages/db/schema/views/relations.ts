import { relations } from "drizzle-orm";
import { mapViews, tableViews, views } from "./schema";
import { projects } from "../projects/schema";

/**
 * PARENT VIEW
 */
export const viewsRelations = relations(views, ({ one }) => ({
  project: one(projects),
  tableView: one(tableViews),
}));

/**
 * TABLE VIEW
 */
export const tableViewsRelations = relations(tableViews, ({ one }) => ({
  view: one(views, {
    fields: [tableViews.viewId],
    references: [views.id],
  }),
}));

/**
 * MAP VIEW
 */
export const mapViewsRelations = relations(mapViews, ({ one }) => ({
  view: one(views, {
    fields: [mapViews.viewId],
    references: [views.id],
  }),
}));
