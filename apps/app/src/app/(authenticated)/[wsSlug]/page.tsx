import { ConstructionIcon } from "lucide-react";
import { getWorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";
import { notFound } from "next/navigation";
import { WorkspaceLayout } from "./workspace-layout";

export default async function HomePage({
  params,
}: {
  params: { wsSlug: string };
}) {
  const getWorkspaceWithTeamspacesResponse = await getWorkspaceWithTeamspaces({
    slug: params.wsSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceWithTeamspacesResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return <div>Test</div>;

  // return (
  //   <WorkspaceLayout
  //     pathNav={[
  //       { name: workspaceWithTeamspaces.name, href: `/${params.wsSlug}` },
  //     ]}
  //     currentWorkspaceSlug={params.wsSlug}
  //   >
  //     <div className="flex justify-center items-center w-full">
  //       <div className="text-muted-foreground flex flex-col gap-2 items-center">
  //         <ConstructionIcon className="size-6" />
  //         <p>This page is under construction</p>
  //       </div>
  //     </div>
  //   </WorkspaceLayout>
  // );
}
