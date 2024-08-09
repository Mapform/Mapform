"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createDataTrackSchema } from "./schema";

export const createDataTrack = authAction
  .schema(createDataTrackSchema)
  .action(async ({ parsedInput: { formId, startStepIndex, endStepIndex } }) => {
    await prisma.dataTrack.create({
      data: {
        formId,
        startStepIndex,
        endStepIndex,
      },
    });

    revalidatePath("/");
  });
