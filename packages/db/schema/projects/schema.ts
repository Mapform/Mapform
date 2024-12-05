import { timestamp, pgTable, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";
import { datasets } from "../datasets/schema";

export const shareAccessEnum = pgEnum("dataset_type", [
  "closed",
  "public",
  "workspace",
]);

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  icon: varchar("icon", { length: 256 }),

  shareAccess: shareAccessEnum("type").default("closed").notNull(),

  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id, { onDelete: "cascade" }),

  // For project pages. The project cannot exist without a pages dataset.
  pagesDatasetId: uuid("pages_dataset_id")
    .references(() => datasets.id, {
      onDelete: "cascade",
    })
    .notNull(),
  // For project submissions
  submissionsDatasetId: uuid("submissions_dataset_id").references(
    () => datasets.id,
    { onDelete: "set null" },
  ),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
