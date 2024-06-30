"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createDataTrackSchema } from "./schema";

export const createDataTrack = authAction(
  createDataTrackSchema,
  async ({ data: { formId, startStepIndex, endStepIndex } }) => {
    await prisma.dataTrack.create({
      data: {
        formId,
        startStepIndex,
        endStepIndex,
      },
    });

    revalidatePath("/");
  }
);
