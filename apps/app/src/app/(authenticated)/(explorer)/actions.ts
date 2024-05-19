"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { clerkClient, auth } from "@clerk/nextjs";
import { action } from "~/lib/safe-action";
import { createOrgSchema } from "./[orgSlug]/schema";

export const createOrg = action(createOrgSchema, async ({ name }) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

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
});
