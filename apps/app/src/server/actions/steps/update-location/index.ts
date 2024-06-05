"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateStepLocationSchema } from "./schema";

export const updateStepWithLocation = authAction(
  updateStepLocationSchema,
  async ({ stepId, data }, { orgId }) => {
    const stepOfOrg = await prisma.step.findUnique({
      where: {
        id: stepId,
        form: {
          workspace: {
            organizationId: orgId,
          },
        },
      },
    });

    if (!stepOfOrg?.formId) {
      throw new Error("User does not have access to this organization.");
    }

    await prisma.step
      .updateWithLocation({
        stepId,
        latitude: data.latitude,
        longitude: data.longitude,
        bearing: data.bearing,
        pitch: data.pitch,
        zoom: data.zoom,
      })
      .catch((e) => {
        console.error(e);
        throw new Error("Failed to update step with location");
      });

    await prisma.form.update({
      where: {
        id: stepOfOrg.formId,
      },
      data: {
        isDirty: true,
      },
    });

    revalidatePath("/");
  }
);
