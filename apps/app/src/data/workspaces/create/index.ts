"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createWorkspaceSchema } from "./schema";

export const createWorkspace = authAction
  .schema(createWorkspaceSchema)
  .action(
    async ({ parsedInput: { name, organizationSlug }, ctx: { userId } }) => {
      const slug = slugify(name, {
        lower: true,
        strict: true,
      });

      // Check if user has access to the organization
      const organization = await prisma.organization.findFirst({
        where: {
          slug: organizationSlug,
          members: {
            some: {
              userId,
            },
          },
        },
      });

      if (!organization) {
        throw new Error("Not authorized");
      }

      await prisma.workspace.create({
        data: {
          name,
          slug,
          organization: {
            connect: {
              slug: organizationSlug,
            },
          },
        },
      });

      revalidatePath("/");
    }
  );
