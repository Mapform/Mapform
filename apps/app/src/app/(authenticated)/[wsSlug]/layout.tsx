import { notFound } from "next/navigation";
import { StandardLayout } from "~/components/standard-layout";
import { getWorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";
import { BottomContent, TopContent } from "./layout-content";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { wsSlug: string };
}) {
  const getWorkspaceWithTeamspacesResponse = await getWorkspaceWithTeamspaces({
    slug: params.wsSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceWithTeamspacesResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return (
    <StandardLayout
      bottomContent={<BottomContent />}
      currentWorkspaceSlug={params.wsSlug}
      topContent={
        <TopContent
          workspaceSlug={params.wsSlug}
          workspaceWithTeamspaces={workspaceWithTeamspaces}
        />
      }
    >
      {children}
    </StandardLayout>
  );
}
