import type { SearchParams } from "~/lib/params/server";
import { Drawers } from "./drawers";
import { MapPadding } from "./map-padding";

interface HomePage {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

const SettingsPage = (props: HomePage) => {
  return (
    <>
      <Drawers {...props} />
      <MapPadding />
    </>
  );
};
export default SettingsPage;
