import { StandardLayout } from "~/components/standard-layout";
import { getUserOrgWorkspaces } from "~/data/workspaces/get-user-org-workspaces";
import { BottomContent, TopContent } from "./layout-content";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  const userOrgWorkspaces = await getUserOrgWorkspaces({
    orgSlug: params.orgSlug,
  });

  return (
    <StandardLayout
      bottomContent={<BottomContent />}
      currentOrgSlug={params.orgSlug}
      topContent={
        <TopContent
          orgSlug={params.orgSlug}
          userOrgWorkspaces={userOrgWorkspaces}
        />
      }
    >
      {children}
    </StandardLayout>
  );
}
