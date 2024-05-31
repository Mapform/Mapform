"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs";
import { authAction } from "~/lib/safe-action";
import { createOrgSchema } from "./schema";

export const createOrg = authAction(
  createOrgSchema,
  async ({ name }, { userId }) => {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const clerkOrg = await clerkClient.organizations.createOrganization({
      name,
      slug,
      createdBy: userId,
    });

    const memberships =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: clerkOrg.id,
      });

    await prisma.organization.create({
      data: {
        id: clerkOrg.id,
        name: clerkOrg.name,
        slug,
        members: {
          createMany: {
            data: memberships.map((membership) => ({
              id: membership.id,
              userId: membership.publicUserData!.userId,
              role: membership.role,
            })),
          },
        },
      },
    });

    revalidatePath("/");
  }
);
