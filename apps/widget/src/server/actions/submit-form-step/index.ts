"use server";

import { prisma } from "@mapform/db";
import { getZodSchemaFromBlockNote } from "@mapform/mapform/lib/zod-schema-from-blocknote";
import { action } from "~/lib/safe-action";
import { submitFormStepSchema } from "./schema";

export const submitFormStep = action(
  submitFormStepSchema,
  async ({ stepId, payload }) => {
    const step = await prisma.step.findUnique({
      where: {
        id: stepId,
      },
    });

    if (!step) {
      throw new Error("Step not found");
    }

    // TODO: VALIDATION

    const validationSchema = getZodSchemaFromBlockNote(step.description as any);

    const { success, error } = validationSchema.safeParse(payload);

    console.log(999999, success, error);
  }
);
