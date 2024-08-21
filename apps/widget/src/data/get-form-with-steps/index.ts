"server-only";

import { prisma } from "@mapform/db";

export async function getFormWithSteps(formId: string) {
  const form = (
    await prisma.form.findMany({
      where: { rootFormId: formId },
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
