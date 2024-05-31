"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { deleteStepSchema } from "./schema";

export const deleteStep = authAction(
  deleteStepSchema,
  async ({ stepId }, { orgId }) => {
    const userStep = await prisma.step.findUnique({
      where: {
        id: stepId,
        form: {
          workspace: {
            organizationId: orgId,
          },
        },
      },
    });

    if (!userStep) {
      throw new Error("User does not have access to this organization.");
    }

    /**
     * This uses the Prisma extension to create a step with a location
     */
    await prisma.step.deleteWithLocation({
      stepId,
    });

    revalidatePath("/");
  }
);
