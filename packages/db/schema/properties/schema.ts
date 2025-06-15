import { timestamp, pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";

export const propertyTypeEnum = pgEnum("property_type", [
  "string",
  "bool",
  "number",
  "date",
]);

export const properties = pgTable("property", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: propertyTypeEnum("type").notNull(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
