import { z } from "zod";
import { type prisma } from "@mapform/db";

export const getFormWithStepsSchema = z.object({
  formId: z.string(),
});

export type GetFormWithStepsSchema = z.infer<typeof getFormWithStepsSchema>;
export type StepsType = Awaited<
  ReturnType<typeof prisma.step.findManyWithLocation>
>;
