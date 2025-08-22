import type { SearchParams } from "~/lib/params/server";
import { Drawers } from "./drawers";

interface HomePage {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

const SettingsPage = (props: HomePage) => {
  return <Drawers {...props} />;
};
export default SettingsPage;
