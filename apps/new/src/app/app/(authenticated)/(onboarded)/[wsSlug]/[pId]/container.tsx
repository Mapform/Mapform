"use client";

import { MapDrawer } from "~/components/map-drawer";

export function Container({ children }: { children: React.ReactNode }) {
  return <MapDrawer open={true}>{children}</MapDrawer>;
}
