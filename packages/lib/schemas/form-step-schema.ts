import { z } from "zod";

export const shortTextInputValueSchema = z.string();
export const formSchema = z.record(z.string(), shortTextInputValueSchema);
export type FormSchema = z.infer<typeof formSchema>;
