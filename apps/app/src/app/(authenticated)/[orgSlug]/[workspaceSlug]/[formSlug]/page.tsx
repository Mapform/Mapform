import { formModel } from "@mapform/db/models";
import { MapForm } from "@mapform/mapform";

export default async function Workspace({
  params,
}: {
  params: { formSlug: string; orgSlug: string; workspaceSlug: string };
}) {
  const form = await formModel.findOne({
    slug: params.formSlug.toLocaleLowerCase(),
    workspaceSlug: params.workspaceSlug.toLocaleLowerCase(),
    organizationSlug: params.orgSlug.toLocaleLowerCase(),
  });

  if (!form) {
    // TODO: 404
    return <div>Form not found</div>;
  }

  return (
    <div>
      {form.name}
      <MapForm />
    </div>
  );
}
