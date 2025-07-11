"use client";

import { Marker } from "react-map-gl/mapbox";
import { useWorkspace } from "./workspace-context";

export function ProjectMarkers() {
  const { workspaceDirectory } = useWorkspace();

  return (
    <>
      {workspaceDirectory.teamspaces.flatMap((ts) =>
        ts.projects.flatMap((p) => (
          <Marker
            key={p.id}
            longitude={p.center.coordinates[0]}
            latitude={p.center.coordinates[1]}
          />
        )),
      )}
    </>
  );
}
