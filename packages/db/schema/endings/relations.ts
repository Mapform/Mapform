import { relations } from "drizzle-orm";
import { pages } from "../pages/schema";
import { endings } from "./schema";

export const endingsRelations = relations(endings, ({ one }) => ({
  page: one(pages, {
    fields: [endings.projectId],
    references: [pages.id],
  }),
}));
