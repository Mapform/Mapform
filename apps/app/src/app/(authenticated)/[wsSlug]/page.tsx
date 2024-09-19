import { notFound, redirect } from "next/navigation";
import { getWorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";

export default async function Organization({
  params,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
}) {
  const workspaceWithTeamspacesResponse = await getWorkspaceWithTeamspaces({
    slug: params.wsSlug,
  });

  const workspaceWithTeamspaces = workspaceWithTeamspacesResponse?.data;

  return <div>Hello</div>;

  if (!workspaceWithTeamspaces?.teamspaces) {
    return notFound();
  }

  return redirect(`/${workspaceWithTeamspaces.teamspaces[0]?.slug}/teams`);
}
