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
  const { drawerDepth, params } = useParamsContext();
  const workspace = useWorkspace();

  const openDrawer = pathname !== `/app/${workspace.workspaceSlug}`;

  const isFullWidth = Boolean(
    workspace.workspaceDirectory.teamspaces
      .flatMap((ts) => ts.projects.flatMap((p) => p.views))
      .find((v) => v.id === params.viewId)?.type === "table",
  );

  return (
    <>
      <MapDrawer
        open={openDrawer}
        depth={drawerDepth.size}
        isFullWidth={isFullWidth}
      >
        {children}
      </MapDrawer>

      {/* This is used to render the HomePage content  */}
      {!openDrawer && children}
    </>
  );
}
