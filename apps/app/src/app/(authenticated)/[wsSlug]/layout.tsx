import { StandardLayout } from "~/components/standard-layout";
import { getUserWorkspace } from "~/data/workspaces/get-user-workspace";
import { BottomContent, TopContent } from "./layout-content";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { wsSlug: string };
}) {
  const userOrgWorkspaces = await getUserWorkspace({
    wsSlug: params.wsSlug,
  });

  return (
    <StandardLayout
      bottomContent={<BottomContent />}
      currentOrgSlug={params.wsSlug}
      topContent={
        <TopContent
          orgSlug={params.wsSlug}
          userOrgWorkspaces={userOrgWorkspaces}
        />
      }
    >
      {children}
    </StandardLayout>
  );
}
