import type { SearchParams } from "~/lib/params/server";
import { Drawers } from "../drawers";
import { MapPadding } from "../map-padding";

interface ProjectPage {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

const SettingsPage = (props: ProjectPage) => {
  return (
    <>
      <Drawers {...props} />
      <MapPadding forceOpen />
    </>
  );
};
export default SettingsPage;
