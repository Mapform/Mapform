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
    <div className="flex flex-1">
      <div className="h-[500px] w-full p-4 bg-slate-100">
        <MapForm mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN} />
      </div>
      {/* SIDE BAR */}
      <div className="w-[400px] border-l">Side</div>
    </div>
  );
}
