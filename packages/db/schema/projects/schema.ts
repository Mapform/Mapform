import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  pgEnum,
  smallint,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";
import { folders } from "../folders/schema";

export const visibilityEnum = pgEnum("visibility", ["public", "closed"]);

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  description: varchar("description", { length: 512 }),
  icon: varchar("icon", { length: 256 }),

  // For sidebar ordering
  position: smallint("position").notNull().default(0),

  visibility: visibilityEnum("visibility").default("closed").notNull(),

  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),

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
