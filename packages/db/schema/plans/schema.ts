import {
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { workspaces } from "../workspaces/schema";

export const plans = pgTable("plan", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }),

  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeProductId: text("stripe_product_id"),
  subscriptionStatus: varchar("subscription_status", { length: 20 }),

  rowLimit: integer("position").notNull(),

  workspaceSlug: varchar("workspace_slug")
    .notNull()
    .references(() => workspaces.slug, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
