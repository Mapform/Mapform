import {
  date,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const aiTokenUsage = pgTable("ai_token_usage", {
  workspaceSlug: varchar("workspace_slug", { length: 256 }).notNull(),
  day: date("day").notNull(),
  tokensUsed: integer("tokens_used").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

