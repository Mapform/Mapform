import { organizationModel } from "@mapform/db/models";

export default async function Orgnization({
  params,
}: {
  params: { org: string };
}) {
  const org = await organizationModel.findOne(params.org.toLocaleLowerCase());

  if (!org) {
    return <div>Organization not found</div>;
  }

  return <div>{org.name}</div>;
}
