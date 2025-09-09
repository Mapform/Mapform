"use client";

import { Marker, Popup } from "react-map-gl/mapbox";
import { useWorkspace } from "./workspace-context";

export function ProjectMarkers() {
  const { workspaceDirectory } = useWorkspace();
  const projects = workspaceDirectory.teamspaces.flatMap((ts) =>
    ts.projects.flatMap((p) => p),
  );

  return projects.map((p) => (
    // <Popup
    //   key={p.id}
    //   longitude={p.center.coordinates[0]}
    //   latitude={p.center.coordinates[1]}
    //   anchor="bottom"
    //   // onClose={() => {}}
    // >
    //   {p.name ?? "Untitled Project"}
    // </Popup>
    <>
      <Marker
        key={p.id}
        longitude={p.center.coordinates[0]}
        latitude={p.center.coordinates[1]}
      />
      <Marker
        key={p.id}
        longitude={p.center.coordinates[0]}
        latitude={p.center.coordinates[1]}
      >
        <div className="prose absolute bottom-0 left-0 h-28 w-40 -translate-x-1/2 rounded-md bg-white p-4 shadow-md">
          {p.name ?? "New Map"}
        </div>
      </Marker>
    </>
  ));
}
