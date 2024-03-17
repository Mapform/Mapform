import { organizationModel } from "@mapform/db/models";
import Create from "./Create";

export default async function Orgnization({
  params,
}: {
  params: { orgSlug: string };
}) {
  const org = await organizationModel.findOne(
    params.orgSlug.toLocaleLowerCase()
  );

  if (!org) {
    return <div>Organization not found</div>;
  }

  return (
    <div>
      {org.name}
      <Create organizationId={org.slug} />
    </div>
  );
}
