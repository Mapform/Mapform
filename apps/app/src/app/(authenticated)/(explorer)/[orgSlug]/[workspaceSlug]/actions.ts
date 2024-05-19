"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { action } from "~/lib/safe-action";
import { createFormSchema } from "./schema";

export const createForm = action(
  createFormSchema,
  async ({ name, workspaceId }) => {
    const { userId } = auth();

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // TODO: Check if user has access to the workspace

    await prisma.form.create({
      data: {
        slug,
        name,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });

    revalidatePath("/");
  }
);
