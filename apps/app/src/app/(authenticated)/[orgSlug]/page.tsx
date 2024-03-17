import { organizationModel } from "@mapform/db/models";
import Create from "./Create";

export default async function Orgnization({
  params,
}: {
  params: { orgSlug: string };
}) {
  const org = await organizationModel.findOne({
    slug: params.orgSlug.toLocaleLowerCase(),
  });

  if (!org) {
    // TODO: 404
    return <div>Organization not found</div>;
  }

  return (
    <div>
      {org.name}
      <Create organizationId={org.slug} />
    </div>
  );
}
