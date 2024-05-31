"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getFormWithStepsSchema } from "./schema";

export const getFormWithSteps = authAction(
  getFormWithStepsSchema,
  async ({ formId }) => {
    // TODO: Check if form belongs to the user

    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) {
      return null;
    }

    const steps = await prisma.step.findManyWithLocation({
      formId: form.id,
    });

    return {
      ...form,
      steps,
    };
  }
);
