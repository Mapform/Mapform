import { timestamp, pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { layers } from "../layers";
import { pages } from "../pages";

export const layersToPages = pgTable(
  "layers_to_pages",
  {
    layerId: uuid("layer_id")
      .notNull()
      .references(() => layers.id),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.layerId, t.pageId] }),
  })
);

export const layersRelations = relations(layers, ({ one, many }) => ({}));
