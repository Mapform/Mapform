import { prisma } from "@mapform/db";
import OrgLayout from "../org-layout";

export default async function Settings({
  params,
}: {
  params: { orgSlug: string };
}) {
  const currentOrg = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
    },
    include: {
      workspaces: true,
    },
  });

  if (!currentOrg) {
    return <div>Organization not found</div>;
  }

  return (
    <OrgLayout name={currentOrg.name} slug={params.orgSlug}>
      Settings
    </OrgLayout>
  );
}
