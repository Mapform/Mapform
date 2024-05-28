"use server";

import { prisma } from "@mapform/db";

export async function getFormWithSteps(formId: string) {
  const form = await prisma.form.findUnique({
    where: { id: formId },
  });

  if (!form) {
    return null;
  }

  const steps = await prisma.step.findManyWithLocation({
    formId: form.id,
  });

  return {
    ...form,
    steps,
  };
}

export type FormWithSteps = Awaited<ReturnType<typeof getFormWithSteps>>;

export async function getInputValues(formSubmissionId: string) {
  return prisma.shortTextInputResponse.findMany({
    where: {
      formSubmissionId,
    },
  });
}
