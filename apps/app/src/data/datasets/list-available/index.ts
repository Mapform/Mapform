"use server";

import { prisma } from "@mapform/db";
import { authAction } from "~/lib/safe-action";
import { listAvailableSchema } from "./schema";

export const listAvailableDatasets = authAction
  .schema(listAvailableSchema)
  .action(async ({ parsedInput: { formId }, ctx: { userId } }) => {
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
      include: {
        columns: true,
      },
    });
  });
