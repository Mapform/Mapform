import { prisma } from "@mapform/db";
import { auth } from "~/lib/auth";

export async function getUserOrgs() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
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
