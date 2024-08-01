"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createStepSchema } from "./schema";

export const createStep = authAction
  .schema(createStepSchema)
  .action(async ({ parsedInput: { formId, location } }) => {
    // TODO: Check if form belongs to the user

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

      await tx.form.update({
        where: {
          id: formId,
        },
        data: {
          isDirty: true,
        },
      });

      revalidatePath("/");

      return newStep;
    });
  });
