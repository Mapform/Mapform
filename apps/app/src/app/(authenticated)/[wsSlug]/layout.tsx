import { notFound } from "next/navigation";
import { StandardLayout } from "~/components/standard-layout";
import { getWorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";
import { BottomContent, TopContent } from "./layout-content";

export default async function WorkspaceLayout({
  params,
  children,
  nav,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
  nav?: React.ReactNode;
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
      // drawerContent={drawerContent}
      topContent={
        <TopContent
          workspaceSlug={params.wsSlug}
          workspaceWithTeamspaces={workspaceWithTeamspaces}
        />
      }
      navSlot={nav}
      // {...rest}
    >
      {children}
    </StandardLayout>
  );
}
