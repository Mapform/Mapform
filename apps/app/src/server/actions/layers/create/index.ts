import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createLayerSchema } from "./schema";

export const createLayerAction = authAction(
  createLayerSchema,
  async ({ name }) => {}
);
