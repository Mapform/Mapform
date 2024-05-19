import { workspaceModel } from "..";
import { prisma } from "../..";
import type { Prisma } from "../..";
import type { PrismaClient } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.form.findUnique>[0]["include"],
  U extends Prisma.FormGetPayload<{
    include: T;
  }>,
>(
  {
    slug,
    workspaceSlug,
    organizationSlug,
    isPublished,
  }: {
    slug: string;
    workspaceSlug: string;
    organizationSlug: string;
    isPublished: boolean;
  },
  include?: T
): Promise<U | null> {
  const workspace = await workspaceModel.findOne({
    slug: workspaceSlug,
    organizationSlug,
  });

  if (!workspace) {
    return null;
  }

  const form = (await prisma.form.findUnique({
    where: {
      workspaceId_slug_isPublished: {
        workspaceId: workspace.id,
        slug,
        isPublished,
      },
    },
    include,
  })) as U;

  return form;
}

export async function create({
  workspaceSlug,
  organizationSlug,
  ...data
}: {
  slug: string;
  name: string;
  workspaceSlug: string;
  organizationSlug: string;
}) {
  const workspace = await workspaceModel.findOne({
    slug: workspaceSlug,
    organizationSlug,
  });

  if (!workspace) {
    return null;
  }

  return prisma.form.create({
    data: {
      ...data,
      workspaceId: workspace.id,
    },
  });
}
