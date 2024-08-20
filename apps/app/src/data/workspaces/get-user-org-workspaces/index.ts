"server-only";

import { prisma } from "@mapform/db";
import { auth } from "~/lib/auth";

/**
 * Finds all workspaces that the user is a member of in the given organization.
 */
export async function getUserOrgWorkspaces({ orgSlug }: { orgSlug: string }) {
  const session = await auth();

  return prisma.workspace.findMany({
    where: {
      organization: {
        slug: orgSlug,
        members: {
          some: {
            userId: session?.user?.id,
          },
        },
      },
    },
    include: {
      forms: {
        where: {
          isRoot: true,
        },
        select: {
          id: true,
          name: true,
          isRoot: true,
        },
      },
    },
  });
}

export type UserOrgWorkspaces = Awaited<
  ReturnType<typeof getUserOrgWorkspaces>
>;
