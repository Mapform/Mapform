"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateFormSchema } from "./schema";

export const updateForm = authAction
  .schema(updateFormSchema)
  .action(async ({ parsedInput: { formId, data }, ctx: { userId } }) => {
    const userForm = await prisma.form.findUnique({
      where: {
        id: formId,
        workspace: {
          organization: {
            members: {
              some: {
                // Ensure the user is a member of the organization
                userId,
              },
            },
          },
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
      data: {
        ...data,
        isDirty: true,
      },
    });

    revalidatePath("/");
  });
