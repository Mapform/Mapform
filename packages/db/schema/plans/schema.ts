import {
  timestamp,
  pgTable,
  text,
  varchar,
  uuid,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { workspaces } from "../workspaces/schema";

export const plans = pgTable(
  "plan",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 64 }).notNull(),

    stripeCustomerId: text("stripe_customer_id").unique().notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").unique().notNull(),
    stripeProductId: text("stripe_product_id").notNull(),
    subscriptionStatus: varchar("subscription_status", {
      length: 20,
    }).notNull(),

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
  },
  (t) => [unique().on(t.workspaceSlug)],
);
