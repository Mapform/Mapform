import { prisma } from "@mapform/db";
import { auth } from "~/lib/auth";
import WorkspaceLayout from "../workspace-layout";

export default async function Organization({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string };
}) {
  const session = await auth();

  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: params.workspaceSlug,
      organization: {
        slug: params.orgSlug,
        members: {
          some: {
            userId: session?.user?.id,
          },
        },
      },
    },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <WorkspaceLayout
      name={workspace.name}
      orgSlug={params.orgSlug}
      workspaceId={workspace.id}
      workspaceSlug={params.workspaceSlug}
    >
      Settings
    </WorkspaceLayout>
  );
}
