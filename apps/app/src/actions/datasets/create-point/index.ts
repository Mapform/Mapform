"use server";

import { revalidatePath } from "next/cache";
import { createPoint } from "@mapform/backend/datasets/create-point";
import { createPointSchema } from "@mapform/backend/datasets/create-point/schema";
import { authAction } from "~/lib/safe-action";

export const createPointAction = authAction
  .schema(createPointSchema)
  .action(async ({ parsedInput }) => {
    await createPoint(parsedInput);

    revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");
  });
