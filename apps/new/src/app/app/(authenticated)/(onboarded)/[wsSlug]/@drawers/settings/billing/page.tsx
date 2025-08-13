import type { SearchParams } from "~/lib/params/server";
import { Drawers } from "../../drawers";

interface ProjectPage {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

const SettingsPage = (props: ProjectPage) => {
  return <Drawers {...props} />;
};
export default SettingsPage;
