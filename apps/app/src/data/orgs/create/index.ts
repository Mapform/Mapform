"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createOrgSchema } from "./schema";

export const createOrg = authAction
  .schema(createOrgSchema)
  .action(async ({ parsedInput: { name }, ctx: { userId } }) => {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    await prisma.organization.create({
      data: {
        name,
        slug,
        members: {
          createMany: {
            data: [
              {
                userId,
                role: "OWNER",
              },
            ],
          },
        },
      },
    });

    revalidatePath("/");
  });
