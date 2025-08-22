"use client";

import { MapDrawer } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";

export function SettingsDrawer({ children }: { children: React.ReactNode }) {
  const { drawerDepth } = useParamsContext();

  return (
    <MapDrawer open depth={drawerDepth.size}>
      {children}
    </MapDrawer>
  );
}
