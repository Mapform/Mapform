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

  const isFullWidth =
    Boolean(
      workspace.workspaceDirectory.teamspaces
        .flatMap((ts) => ts.projects.flatMap((p) => p.views))
        .find((v) => v.id === params.viewId)?.type === "table",
    ) &&
    !params.chatId &&
    !params.search &&
    !params.rowId &&
    !params.stadiaId &&
    !params.marker;

  console.log(11111, workspace.currentProject);

  return (
    <>
      <MapDrawer
        open={openDrawer}
        depth={drawerDepth.size}
        isFullWidth={isFullWidth}
        viewState={{
          center: workspace.currentProject?.center.coordinates,
          zoom: workspace.currentProject?.zoom,
          pitch: workspace.currentProject?.pitch,
          bearing: workspace.currentProject?.bearing,
        }}
      >
        {children}
      </MapDrawer>

      {/* This is used to render the HomePage content  */}
      {!openDrawer && children}
    </>
  );
}
