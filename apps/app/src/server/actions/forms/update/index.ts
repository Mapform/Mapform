"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateFormSchema } from "./schema";

export const updateForm = authAction(
  updateFormSchema,
  async ({ formId, data }, { orgId }) => {
    const userForm = await prisma.form.findUnique({
      where: {
        id: formId,
        workspace: {
          organizationId: orgId,
        },
      },
    });

    if (!userForm) {
      throw new Error("User does not have access to this form.");
    }

    await prisma.form.update({
      where: {
        id: formId,
      },
      data,
    });

    revalidatePath("/");
  }
);
