import {
  date,
  integer,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { workspaces } from "../workspaces/schema";

export const aiTokenUsage = pgTable(
  "ai_token_usage",
  {
    workspaceSlug: varchar("workspace_slug")
      .notNull()
      .references(() => workspaces.slug, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    day: date("day").notNull(),
    tokensUsed: integer("tokens_used").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique().on(t.workspaceSlug, t.day)],
);
