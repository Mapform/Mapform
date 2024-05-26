"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { action } from "~/lib/safe-action";
import { publishFormSchema } from "./schema";

export const publishForm = action(publishFormSchema, async ({ formId }) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const draftForm = await prisma.form.findUnique({
    where: {
      id: formId,
    },
  });

  if (!draftForm) {
    throw new Error("Form not found");
  }

  const steps = await prisma.step.findManyWithLocation({
    formId: draftForm.id,
  });

  // TODO: Wrap this in a transaction

  if (draftForm.publishedFormId) {
    await prisma.form.update({
      where: {
        id: draftForm.publishedFormId,
      },
      data: {
        steps: {
          deleteMany: {},
        },
      },
    });

    await Promise.all(
      steps.map((step) => {
        return prisma.step.createWithLocation({
          formId: draftForm.publishedFormId!,
          zoom: step.zoom,
          pitch: step.pitch,
          bearing: step.bearing,
          latitude: step.latitude,
          longitude: step.longitude,
        });
      })
    );

    await prisma.form.update({
      where: {
        id: draftForm.id,
      },
      data: {
        isDirty: false,
      },
    });
  } else {
    const publishedForm = await prisma.form.create({
      data: {
        ...draftForm,
        isPublished: true,
        id: undefined,
      },
    });

    await Promise.all(
      steps.map((step) => {
        return prisma.step.createWithLocation({
          formId: publishedForm.id,
          zoom: step.zoom,
          pitch: step.pitch,
          bearing: step.bearing,
          latitude: step.latitude,
          longitude: step.longitude,
        });
      })
    );

    await prisma.form.update({
      where: {
        id: draftForm.id,
      },
      data: {
        publishedFormId: publishedForm.id,
        isDirty: false,
      },
    });
  }

  // Crearte a new published form, or update the existing one

  revalidatePath("/");
});
