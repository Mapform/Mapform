import { organizationModel } from "..";
import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.workspace.findUnique>[0]["include"],
>(
  {
    slug,
    organizationSlug,
  }: {
    slug: string;
    organizationSlug: string;
  },
  include?: T
) {
  const org = await organizationModel.findOne({
    slug: organizationSlug,
  });

  if (!org) {
    return null;
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug,
      },
    },
    include,
  });

  return workspace;
}

export async function create(
  data: Prisma.Args<typeof prisma.workspace, "create">["data"]
) {
  return prisma.workspace.create({
    data,
  });
}
