import { workspaceModel } from "..";
import { prisma } from "../..";

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
