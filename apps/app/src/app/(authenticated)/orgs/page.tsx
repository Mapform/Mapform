import { getUserOrgs } from "./requests";

export default async function Home() {
  const userOrgs = await getUserOrgs();

  const firstOrgSlug = userOrgs?.organizationMemberships[0]?.organization.slug;

  return <div>Explorer root</div>;

  // if (!firstOrgSlug) {
  //   redirect(`/new`);
  // }

  // redirect(`/${userWithOrgs.organizationMemberships[0]?.organization.slug}`);
}
