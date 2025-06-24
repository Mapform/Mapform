import { z } from "zod/v4";

export const shortTextInputValueSchema = z.string();
export const formSchema = z.record(z.string(), shortTextInputValueSchema);
export type FormSchema = z.infer<typeof formSchema>;
