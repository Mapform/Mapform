import { relations } from "drizzle-orm";
import { rows } from "./schema";

export const rowsRelations = relations(rows, ({ one, many }) => ({}));
