"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createLayerSchema } from "./schema";

export const createLayerAction = authAction
  .schema(createLayerSchema)
  .action(async ({ parsedInput: { name } }) => {});
