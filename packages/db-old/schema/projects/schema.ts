import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";
import { datasets } from "../datasets/schema";

export const visibilityEnum = pgEnum("visibility", ["public", "closed"]);

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  icon: varchar("icon", { length: 256 }),

  visibility: visibilityEnum("visibility").default("public").notNull(),

  formsEnabled: boolean("forms_enabled").default(false).notNull(),

  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id, { onDelete: "cascade" }),

  datasetId: uuid("dataset_id").references(() => datasets.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
