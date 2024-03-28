import { organizationModel } from "..";
import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.workspace.findUnique>[0]["include"],
  U extends Prisma.WorkspaceGetPayload<{
    include: T;
  }>,
>(
  {
    slug,
    organizationSlug,
  }: {
    slug: string;
    organizationSlug: string;
  },
  include?: T
): Promise<U | null> {
  const org = await organizationModel.findOne({
    slug: organizationSlug,
  });

  if (!org) {
    return null;
  }

  const workspace = (await prisma.workspace.findUnique({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug,
      },
    },
    include,
  })) as U;

  return workspace;
}

export async function create(
  data: Prisma.Args<typeof prisma.workspace, "create">["data"]
) {
  return prisma.workspace.create({
    data,
  });
}
