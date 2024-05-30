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
        stepOrder: [],
        steps: {
          deleteMany: {},
        },
      },
    });

    /**
     * TODO: Improve this
     *
     * Synchronously create the steps for the published form. We need to do this
     * so that the step order is correct. This is pretty slow though, and we can
     * prob improve this, perhaps by moving the logic to update the step order
     * from outside the createWithLocation func.
     */
    await steps.reduce(
      (acc, step) =>
        acc.then(() => {
          return prisma.step.createWithLocation({
            formId: draftForm.publishedFormId!,
            zoom: step.zoom,
            pitch: step.pitch,
            bearing: step.bearing,
            latitude: step.latitude,
            longitude: step.longitude,
            title: step.title,
            description: step.description || undefined,
          });
        }),
      Promise.resolve()
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
          title: step.title,
          description: step.description || undefined,
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
