import { timestamp, pgTable, uuid, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { layers } from "../layers";
import { teamspaces } from "../teamspaces";

export const datasets = pgTable("dataset", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  icon: varchar("icon", { length: 256 }),
  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const datasetsRelations = relations(datasets, ({ one, many }) => ({
  teamspace: one(teamspaces, {
    fields: [datasets.teamspaceId],
    references: [teamspaces.id],
  }),
  layers: many(layers),
}));
