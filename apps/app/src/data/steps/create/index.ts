"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createStepSchema } from "./schema";

export const createStep = authAction
  .schema(createStepSchema)
  .action(async ({ parsedInput: { formId, location }, ctx: { userId } }) => {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
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
    });

    if (!form) {
      throw new Error("Form not found");
    }

    /**
     * This uses the Prisma extension to create a step with a location
     */
    return prisma.$transaction(async (tx) => {
      const newStep = await tx.step.createWithLocation({
        formId,
        zoom: location.zoom,
        pitch: location.pitch,
        bearing: location.bearing,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      const updatedForm = await tx.form.update({
        where: {
          id: formId,
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
        `/orgs/${updatedForm.workspace.organization.slug}/workspaces/${updatedForm.workspace.slug}/forms/${updatedForm.id}`
      );

      return newStep;
    });
  });
