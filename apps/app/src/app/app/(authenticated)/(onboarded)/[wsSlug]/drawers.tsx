"use client";

import { usePathname } from "next/navigation";
import { MapDrawer } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { useWorkspace } from "./workspace-context";

interface DrawersProps {
  children: React.ReactNode;
}

export function Drawers({ children }: DrawersProps) {
  const pathname = usePathname();
  const { drawerDepth } = useParamsContext();
  const workspace = useWorkspace();

  const open = pathname !== `/app/${workspace.workspaceSlug}`;

  return (
    <MapDrawer open={open} depth={drawerDepth.size}>
      {children}
    </MapDrawer>
  );
}
