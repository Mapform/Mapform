"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateStepLocationSchema } from "./schema";

export const updateStepWithLocation = authAction(
  updateStepLocationSchema,
  async ({ stepId, data }, { orgId }) => {
    // if (!data.formId) {
    //   throw new Error("Form ID is required.");
    // }

    // const userForm = await prisma.form.findUnique({
    //   where: {
    //     id: data.formId,
    //     workspace: {
    //       organizationId: orgId,
    //     },
    //   },
    // });

    // if (!userForm) {
    //   throw new Error("User does not have access to this organization.");
    // }

    // await prisma.step.update({
    //   where: {
    //     id: stepId,
    //   },
    //   data,
    // });
    // await prisma.form.update({
    //   where: {
    //     id: data.formId,
    //   },
    //   data: {
    //     isDirty: true,
    //   },
    // });
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

    revalidatePath("/");
  }
);
