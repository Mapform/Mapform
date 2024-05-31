"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateStepSchema } from "./schema";

export const updateStep = authAction(
  updateStepSchema,
  async ({ stepId, data }, { orgId }) => {
    if (!data.formId) {
      throw new Error("Form ID is required.");
    }

    const userForm = await prisma.form.findUnique({
      where: {
        id: data.formId,
        workspace: {
          organizationId: orgId,
        },
      },
    });

    if (!userForm) {
      throw new Error("User does not have access to this organization.");
    }

    await prisma.step.update({
      where: {
        id: stepId,
      },
      // @ts-expect-error -- This is a valid update
      data,
    });
    await prisma.form.update({
      where: {
        id: data.formId,
      },
      data: {
        isDirty: true,
      },
    });

    revalidatePath("/");
  }
);
