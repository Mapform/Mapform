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
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripeProductId: text("stripe_product_id"),
    stripePriceId: text("stripe_price_id"),
    subscriptionStatus: varchar("subscription_status", {
      length: 20,
    }),

    rowLimit: integer("row_limit").notNull(),
    storageLimit: integer("storage_limit")
      .notNull()
      .default(10 * 1000 * 1000),

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
