"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { listAvailableSchema } from "./schema";

export const listAvailableDatasets = authAction
  .schema(listAvailableSchema)
  .action(async ({ parsedInput: { formId } }) => {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
      select: {
        workspaceId: true,
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    return prisma.dataset.findMany({
      where: {
        workspaceId: form.workspaceId,
      },
    });
  });
