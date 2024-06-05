"use server";

import { prisma } from "@mapform/db";
import { auth } from "@clerk/nextjs";

export const getFormWithSteps = async ({ formId }: { formId: string }) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User does not have access to this form.");
  }

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
      workspace: {
        organization: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    },
  });

  if (!form) {
    throw new Error("User does not have access to this form.");
  }

  const steps = await prisma.step.findManyWithLocation({
    formId: form.id,
  });

  return {
    ...form,
    steps,
  };
};

export type FormWithSteps = NonNullable<
  Awaited<ReturnType<typeof getFormWithSteps>>
>;
