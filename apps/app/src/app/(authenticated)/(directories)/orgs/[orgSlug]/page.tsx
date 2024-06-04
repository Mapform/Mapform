import { prisma } from "@mapform/db";
import OrgLayout from "./org-layout";

export default async function Organization({
  params,
}: {
  params: { orgSlug: string };
  children: React.ReactNode;
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
      <ul>
        {currentOrg.workspaces.map((workspace) => (
          <li key={workspace.id}>{workspace.name}</li>
        ))}
      </ul>
    </OrgLayout>
  );
}
