import { workspaceModel } from "@mapform/db/models";

export default async function Workspace({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  const workspace = await workspaceModel.findOne(
    params.workspaceSlug.toLocaleLowerCase()
  );

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div>
      {workspace.name}
      {/* <Create organizationId={org.slug} /> */}
    </div>
  );
}
