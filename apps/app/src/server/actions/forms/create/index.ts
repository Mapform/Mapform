"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createFormSchema } from "./schema";

export const createForm = authAction
  .schema(createFormSchema)
  .action(async ({ parsedInput: { name, workspaceId } }) => {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // TODO: Check if user has access to the workspace

    await prisma.form.create({
      data: {
        slug,
        name,
        isRoot: true,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        dataset: {
          create: {
            name: `${name} dataset`,
            workspaceId,
          },
        },
      },
    });

    revalidatePath("/");
  });
