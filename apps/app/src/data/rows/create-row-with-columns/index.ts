"use server";

import { authDataService } from "~/lib/safe-action";
import { createRowSchema } from "@mapform/backend/data/rows/create-row/schema";

export const createRowWithColumnsAction = authDataService.authClient
  .schema(createRowSchema)
  .action(async ({ parsedInput: { projectId } }) => {
    const result = await authDataService.$transaction(async (client) => {
      const project = await client.getProject({ projectId });

      project?.data?.columns;

      const row = await client.createRow({ projectId });
      return row;
    });

    return result?.data;
  });
