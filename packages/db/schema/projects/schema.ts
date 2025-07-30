import {
  timestamp,
  pgTable,
  varchar,
  uuid,
  pgEnum,
  integer,
  customType,
} from "drizzle-orm/pg-core";
import { teamspaces } from "../teamspaces/schema";

export const visibilityEnum = pgEnum("visibility", ["public", "closed"]);

const pointGeometry = customType<{
  data: { coordinates: [number, number] };
}>({
  dataType() {
    return "geometry(Point, 4326)";
  },
});

export const projects = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  description: varchar("description", { length: 512 }),
  icon: varchar("icon", { length: 256 }),
  position: integer("position").notNull(),

  center: pointGeometry("center").notNull(),

  visibility: visibilityEnum("visibility").default("closed").notNull(),

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
