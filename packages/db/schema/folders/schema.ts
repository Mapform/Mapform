import { timestamp, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";
import { fileTreePositions } from "../file-tree-positions/schema";

export const folders = pgTable("folder", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  icon: varchar("icon", { length: 256 }),

  teamspaceId: uuid("teamspace_id")
    .notNull()
    .references(() => teamspaces.id, { onDelete: "cascade" }),

  fileTreePositionId: uuid("file_tree_position_id")
    .notNull()
    .references(() => fileTreePositions.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
