import { prisma } from "@mapform/db";

export default async function Organization({
  params,
}: {
  params: { orgSlug: string };
}) {
  const currentOrg = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
    },
  });

  if (!currentOrg) {
    return <div>Organization not found</div>;
  }

  return <div>Workspaces</div>;
}
