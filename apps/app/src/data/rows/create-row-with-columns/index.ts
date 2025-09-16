"use server";

import { revalidatePath } from "next/cache";
import { authClient } from "~/lib/safe-action";
import type { CreateRowSchema } from "@mapform/backend/data/rows/create-row/schema";

export const createRowWithColumnsAction = async (params: CreateRowSchema) => {
  const result = await authClient.$transaction(async (client) => {
    const project = await client.getProject({
      projectId: params.projectId,
    });

    console.log(1111, project);
    return project;
  });

  // 1. Create row has properties included
  // 2. Check if columns are already created
  // 3. If not, create columns
  // 4. Call createRow with the properties included
  // Everything should be wrapped in a transaction
  // const result = await authClient.createColumn(params);
  // revalidatePath("/app/[wsSlug]/[pId]", "page");
  return result;
};
