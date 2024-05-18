import { userModel } from "@mapform/db/models";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  // Need to redirect to the orgs page
  const clerkUser = await currentUser();

  // This shouldn't happen, just for type check
  if (!clerkUser) {
    return null;
  }

  const userWithOrgs = await userModel.findOne(clerkUser.id, {
    organizationMemberships: {
      include: {
        organization: true,
      },
    },
  });

  const firstOrgSlug =
    userWithOrgs?.organizationMemberships[0]?.organization.slug;

  if (!firstOrgSlug) {
    redirect(`/new`);
  }

  redirect(`/${userWithOrgs?.organizationMemberships[0]?.organization.slug}`);
}
