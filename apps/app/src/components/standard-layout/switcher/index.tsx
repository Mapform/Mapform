import { getUserOrgs } from "~/data/orgs/get-user-orgs";
import { SwitcherPopover } from "./popover";

export async function Switcher() {
  const userOrgs = await getUserOrgs();

  return <SwitcherPopover userOrgs={userOrgs} />;
}
