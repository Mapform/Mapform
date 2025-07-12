"use client";

import { MapDrawer } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { useMap } from "react-map-gl/mapbox";

export function Chat() {
  const { map } = useMap();
  const { params, setQueryStates } = useParamsContext();

  return (
    <MapDrawer open={!!params.chatId} depth={0}>
      Chat
    </MapDrawer>
  );
}
