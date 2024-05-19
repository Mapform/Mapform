import { Create } from "./create";
import { getWorkspaceWithOrg } from "./actions";

export default async function Workspace({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string };
}) {
  const workspaceWithOrg = await getWorkspaceWithOrg(
    params.workspaceSlug.toLocaleLowerCase(),
    params.orgSlug
  );

  if (!workspaceWithOrg) {
    // TODO: 404
    return <div>Workspace not found</div>;
  }

  return (
    <div>
      {workspaceWithOrg.name}
      <Create workspaceWithOrg={workspaceWithOrg} />
    </div>
  );
}
