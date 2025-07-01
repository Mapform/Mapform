import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  foreignKey,
  smallint,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";

export const folders = pgTable(
  "folder",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
    icon: varchar("icon", { length: 256 }),

    parentId: uuid("parent_id"),

    // Teamspace reference
    teamspaceId: uuid("teamspace_id")
      .notNull()
      .references(() => teamspaces.id, { onDelete: "cascade" }),

    // Order within parent folder
    position: smallint("position").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  // Parent folder reference (self-referential): https://orm.drizzle.team/docs/indexes-constraints#foreign-key
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "custom_fk",
    }).onDelete("cascade"),
  ],
);
