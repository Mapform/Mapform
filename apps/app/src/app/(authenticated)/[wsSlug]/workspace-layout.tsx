import { notFound } from "next/navigation";
import { StandardLayout } from "~/components/standard-layout";
import type { StandardLayoutProviderProps } from "~/components/standard-layout/context";
import { getWorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";
import { BottomContent, TopContent } from "./layout-content";

export async function WorkspaceLayout({
  children,
  currentWorkspaceSlug,
  drawerContent,
  ...rest
}: StandardLayoutProviderProps) {
  if (!currentWorkspaceSlug) {
    return null;
  }

  const getWorkspaceWithTeamspacesResponse = await getWorkspaceWithTeamspaces({
    slug: currentWorkspaceSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceWithTeamspacesResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return (
    <StandardLayout
      bottomContent={<BottomContent />}
      currentWorkspaceSlug={currentWorkspaceSlug}
      drawerContent={drawerContent}
      topContent={
        <TopContent
          workspaceSlug={currentWorkspaceSlug}
          workspaceWithTeamspaces={workspaceWithTeamspaces}
        />
      }
      {...rest}
    >
      {children}
    </StandardLayout>
  );
}
