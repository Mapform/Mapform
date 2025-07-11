"use client";

import { useParamsContext } from "~/lib/params/client";
import { MapDrawer } from "~/components/map-drawer";

export function Drawers() {
  const { params } = useParamsContext();

  return (
    <>
      {/* Search */}
      <MapDrawer open={params.search === "1"} depth={0}>
        Test
      </MapDrawer>
    </>
  );
}
