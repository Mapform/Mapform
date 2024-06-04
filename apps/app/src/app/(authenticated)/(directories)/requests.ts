import { prisma } from "@mapform/db";
import { currentUser } from "@clerk/nextjs";

export async function getUserOrgs() {
  // Need to redirect to the orgs page
  const clerkUser = await currentUser();

  // This shouldn't happen, just for type check
  if (!clerkUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: clerkUser.id,
    },
    include: {
      organizationMemberships: {
        include: {
          organization: {
            include: {
              workspaces: true,
            },
          },
        },
      },
    },
  });
}

export type UserOrgs = Awaited<ReturnType<typeof getUserOrgs>>;
