import { notFound } from "next/navigation";
import { StandardLayout } from "~/components/standard-layout";
import type { TabsProps } from "~/components/standard-layout/tabs";
import { getWorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";
import { BottomContent, TopContent } from "./layout-content";

export async function WorkspaceLayout({
  children,
  wsSlug,
  drawerContent,
  ...tabProps
}: {
  children: React.ReactNode;
  wsSlug: string;
  drawerContent?: React.ReactNode;
} & Omit<TabsProps, "showNav" | "setShowNav">) {
  const getWorkspaceWithTeamspacesResponse = await getWorkspaceWithTeamspaces({
    slug: wsSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceWithTeamspacesResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return (
    <StandardLayout
      bottomContent={<BottomContent />}
      currentWorkspaceSlug={wsSlug}
      drawerContent={drawerContent}
      topContent={
        <TopContent
          workspaceSlug={wsSlug}
          workspaceWithTeamspaces={workspaceWithTeamspaces}
        />
      }
      {...tabProps}
    >
      {children}
    </StandardLayout>
  );
}
