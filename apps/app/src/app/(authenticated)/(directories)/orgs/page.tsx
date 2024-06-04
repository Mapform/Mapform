import { redirect } from "next/navigation";
import { getUserOrgs } from "../requests";

export default async function Home() {
  const userOrgs = await getUserOrgs();

  const firstOrgSlug = userOrgs?.organizationMemberships[0]?.organization.slug;

  // if (!firstOrgSlug) {
  //   redirect(`/new`);
  // }

  return <div>Orgs</div>;

  // return redirect(
  //   `/${userWithOrgs.organizationMemberships[0]?.organization.slug}`
  // );
}
