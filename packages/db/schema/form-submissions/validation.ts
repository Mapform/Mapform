import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { formSubmissions } from "./schema";

/**
 * FormSubmissions
 */
export const insertFormSubmissionSchema = createInsertSchema(formSubmissions);
export const selectFormSubmissionSchema = createSelectSchema(formSubmissions);

export type InsertFormSubmission = z.infer<typeof selectFormSubmissionSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;
