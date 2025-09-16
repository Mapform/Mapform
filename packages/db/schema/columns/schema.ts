import {
  timestamp,
  pgTable,
  uuid,
  text,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";

export const columnTypeEnum = pgEnum("column_type", [
  "string",
  "bool",
  "number",
  "date",
]);

export const columns = pgTable(
  "column",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: columnTypeEnum("type").notNull(),

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
  },
  (t) => [unique().on(t.projectId, t.name)],
);
