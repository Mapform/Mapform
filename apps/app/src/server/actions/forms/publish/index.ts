"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { publishFormSchema } from "./schema";

/**
 * When we publish, we always create a new form version. By keeping track of
 * version history, we can allow users to revert to previous versions, and we
 * can show more detailed submission results.
 */
export const publishForm = authAction(publishFormSchema, async ({ formId }) => {
  const draftForm = await prisma.form.findUnique({
    where: {
      id: formId,
      isDraft: true,
    },
    include: {
      _count: {
        select: { formVersions: true },
      },
    },
  });

  if (!draftForm) {
    throw new Error("Form not found");
  }

  const steps = await prisma.step.findManyWithLocation({
    formId: draftForm.id,
  });

  /**
   * TODO: Since step.createWithLocation is custom, Prisma transactions don't
   * work here. Instead, I should manually handle the case where one of the
   * steps fails to create.
   */
  const newPublishedForm = await prisma.form.create({
    data: {
      name: draftForm.name,
      slug: draftForm.slug,
      stepOrder: draftForm.stepOrder,
      workspaceId: draftForm.workspaceId,
      isDraft: false,
      draftFormId: draftForm.id,
      version: draftForm._count.formVersions + 1,
    },
  });

  // TODO: Improve this. This query is very slow and inefficient.
  for (const step of steps) {
    // eslint-disable-next-line no-await-in-loop -- We want to execute sequentially
    await prisma.step.createWithLocation({
      formId: newPublishedForm.id,
      zoom: step.zoom,
      pitch: step.pitch,
      bearing: step.bearing,
      latitude: step.latitude,
      longitude: step.longitude,
      title: step.title,
      description: step.description || undefined,
    });
  }

  await prisma.form.update({
    where: {
      id: draftForm.id,
    },
    data: {
      isDirty: false,
    },
  });

  revalidatePath("/");
});
