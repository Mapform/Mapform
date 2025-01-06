import { pgEnum, timestamp, pgTable, uuid, text } from "drizzle-orm/pg-core";
import { pages } from "../pages/schema";

export const endingType = pgEnum("ending_type", ["redirect", "page"]);

export const endings = pgTable("ending", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  endingType: endingType("ending_type").default("page").notNull(),

  // For redirect endings
  redirectUrl: text("redirect_url"),

  // For page endings
  pageTitle: text("page_title"),
  pageContent: text("page_content"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
