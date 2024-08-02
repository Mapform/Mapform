"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { getFormWithStepsSchema } from "./schema";

export const getFormWithSteps = authAction
  .schema(getFormWithStepsSchema)
  .action(async ({ parsedInput: { formId }, ctx: { userId } }) => {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
        workspace: {
          organization: {
            members: {
              some: {
                // Ensure the user is a member of the organization
                userId,
              },
            },
          },
        },
      },
      include: {
        dataTracks: {
          include: {
            layers: {
              include: {
                pointLayer: true,
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
  });

export type FormWithSteps = NonNullable<
  Awaited<ReturnType<typeof getFormWithSteps>>
>;
