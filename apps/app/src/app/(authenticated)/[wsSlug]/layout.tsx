import { StandardLayout } from "~/components/standard-layout";
import { getWorkspace } from "~/data/workspaces/get-workspace";
import { BottomContent, TopContent } from "./layout-content";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { wsSlug: string };
}) {
  // const userOrgWorkspaces = await getWorkspace({
  //   slug: params.wsSlug,
  // });
  // return (
  //   <StandardLayout
  //     bottomContent={<BottomContent />}
  //     currentOrgSlug={params.wsSlug}
  //     topContent={
  //       <TopContent
  //         orgSlug={params.wsSlug}
  //         userOrgWorkspaces={userOrgWorkspaces}
  //       />
  //     }
  //   >
  //     {children}
  //   </StandardLayout>
  // );
  return children;
}
