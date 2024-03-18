import { formModel } from "@mapform/db/models";
import { MapForm } from "@mapform/mapform";
import { env } from "~/env.mjs";

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
      <MapForm mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN} />
    </div>
  );
}
