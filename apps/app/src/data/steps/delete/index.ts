"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { deleteStepSchema } from "./schema";

export const deleteStep = authAction
  .schema(deleteStepSchema)
  .action(async ({ parsedInput: { stepId }, ctx: { userId } }) => {
    const userStep = await prisma.step.findUnique({
      where: {
        id: stepId,
        form: {
          workspace: {
            organization: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
    });

    if (!userStep?.formId) {
      throw new Error("User does not have access to this organization.");
    }

    /**
     * This uses the Prisma extension to create a step with a location
     */
    await prisma.step.deleteWithLocation({
      stepId,
    });

    const form = await prisma.form.update({
      where: {
        id: userStep.formId,
      },
      data: {
        isDirty: true,
      },
      include: {
        workspace: {
          include: {
            organization: true,
          },
        },
      },
    });

    revalidatePath(
      `/orgs/${form.workspace.organization.slug}/workspaces/${form.workspace.slug}/forms/${userStep.formId}`
    );
  });
