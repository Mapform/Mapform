"use server";

import { prisma } from "@mapform/db";

export async function getFormWithSteps(formId: string) {
  const form = (
    await prisma.form.findMany({
      where: { draftFormId: formId },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    })
  )[0];

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
  return prisma.inputResponse.findMany({
    where: {
      formSubmissionId,
    },
  });
}

export async function getSession(formSubmissionId: string) {
  return prisma.formSubmission.findUnique({
    where: {
      id: formSubmissionId,
    },
  });
}
