"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createStepSchema } from "./schema";

export const createStep = authAction(
  createStepSchema,
  async ({ formId, location }) => {
    // TODO: Check if form belongs to the user

    /**
     * This uses the Prisma extension to create a step with a location
     */
    const newStep = await prisma.step.createWithLocation({
      formId,
      zoom: location.zoom,
      pitch: location.pitch,
      bearing: location.bearing,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    revalidatePath("/");

    console.log("CREATED STEP: ", newStep);
    return newStep;
  }
);
