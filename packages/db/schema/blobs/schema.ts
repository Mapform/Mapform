import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const blobs = pgTable("blob", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  url: varchar("url", { length: 2048 }).unique().notNull(),
  // Size in bytes
  size: integer("size").notNull(),
  queuedForDeletionDate: timestamp("queued_for_deletion_date", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
