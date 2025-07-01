import {
  timestamp,
  pgTable,
  uuid,
  smallint,
  pgEnum,
  unique,
  foreignKey,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";

export const itemTypeEnum = pgEnum("item_type", ["folder", "project"]);

export const fileTreePositions = pgTable(
  "file_tree_position",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    parentId: uuid("parent_id"),

    itemType: itemTypeEnum("item_type").notNull(),

    // The teamspace this item belongs to
    teamspaceId: uuid("teamspace_id")
      .notNull()
      .references(() => teamspaces.id, { onDelete: "cascade" }),

    // Position within the folder or root (must be unique within the context)
    position: smallint("position").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "custom_fk",
    }).onDelete("cascade"),

    // Ensure unique position within each folder/root context
    unique().on(table.teamspaceId, table.parentId, table.position),
  ],
);
