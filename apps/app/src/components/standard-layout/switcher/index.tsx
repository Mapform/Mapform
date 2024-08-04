import { getUserOrgs } from "~/data/orgs/get-user-orgs";
import { SwitcherPopover } from "./popover";

export async function Switcher({
  currentOrgSlug,
}: {
  currentOrgSlug?: string;
}) {
  const userOrgs = await getUserOrgs();

  return (
    <SwitcherPopover currentOrgSlug={currentOrgSlug} userOrgs={userOrgs} />
  );
}
