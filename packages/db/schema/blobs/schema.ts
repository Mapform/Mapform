import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { projects } from "../projects/schema";
import { rows } from "../rows/schema";

export const blobs = pgTable(
  "blob",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Note: We do not cascade delete blobs when a workspace is deleted. This is
    // because blob deletion is handled via cron job, and involves deleting the
    // Vercel blob and db record.
    workspaceId: uuid("workspace_id").notNull(),

    // Used for project cover photos
    projectId: uuid("project_id").references(() => projects.id),

    // Used for row cover photos
    rowId: uuid("row_id").references(() => rows.id),

    title: varchar("title", { length: 512 }),
    author: varchar("author", { length: 256 }),
    // source: varchar("source", { length: 512 }),
    license: varchar("license", { length: 256 }),

    url: varchar("url", { length: 2048 }).unique().notNull(),
    // Size in bytes
    size: integer("size").notNull(),
    queuedForDeletionDate: timestamp("queued_for_deletion_date", {
      withTimezone: true,
    }),

    // Used for ordering cover photos
    order: integer("order"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Ensure order is unique for each project
    projectOrderUnique: uniqueIndex("project_order_unique").on(
      table.projectId,
      table.order,
    ),
    // Ensure order is unique for each row
    rowOrderUnique: uniqueIndex("row_order_unique").on(
      table.rowId,
      table.order,
    ),
  }),
);
