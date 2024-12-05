import {
  timestamp,
  pgTable,
  uuid,
  text,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";

export const datasetTypeEnum = pgEnum("dataset_type", [
  "default",
  "pages",
  "submissions",
]);

export const datasets = pgTable("dataset", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  icon: varchar("icon", { length: 256 }),
  type: datasetTypeEnum("type").default("default").notNull(),
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
