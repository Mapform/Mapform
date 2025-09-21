"use client";

import { MapDrawer } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";

export function ChatDrawers({ children }: { children: React.ReactNode }) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer open={!!params.chatId} depth={drawerDepth.get("chatId") ?? 0}>
      {children}
    </MapDrawer>
  );
}
