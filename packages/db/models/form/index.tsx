import { workspaceModel } from "..";
import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.form.findUnique>[0]["include"],
>(
  {
    slug,
    workspaceSlug,
    organizationSlug,
  }: {
    slug: string;
    workspaceSlug: string;
    organizationSlug: string;
  },
  include?: T
) {
  const workspace = await workspaceModel.findOne({
    slug: workspaceSlug,
    organizationSlug,
  });

  if (!workspace) {
    return null;
  }

  const form = await prisma.form.findUnique({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug,
      },
    },
    include,
  });

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
