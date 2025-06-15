import {
  timestamp,
  pgTable,
  uuid,
  primaryKey,
  smallint,
} from "drizzle-orm/pg-core";
import { layers } from "../layers/schema";
import { pages } from "../pages/schema";

export const layersToPages = pgTable(
  "layers_to_pages",
  {
    layerId: uuid("layer_id")
      .notNull()
      .references(() => layers.id, { onDelete: "cascade" }),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),

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
  }),
);
