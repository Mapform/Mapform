"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getFormWithStepsSchema } from "./schema";

export const getFormWithSteps = authAction(
  getFormWithStepsSchema,
  async ({ formId }, { orgId }) => {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
        workspace: {
          organizationId: orgId,
        },
      },
    });

    if (!form) {
      throw new Error("User does not have access to this form.");
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
