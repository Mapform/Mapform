import { timestamp, pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { layersToPages } from "../layers-to-pages";

export const layerTypeEnum = pgEnum("layer_type", ["point"]);

export const layers = pgTable("layer", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  type: layerTypeEnum("type").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const layersRelations = relations(layers, ({ one, many }) => ({
  layersToPages: many(layersToPages),
}));
