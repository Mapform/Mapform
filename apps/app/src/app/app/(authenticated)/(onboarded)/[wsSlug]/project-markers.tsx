"use client";

import { Marker } from "react-map-gl/maplibre";
import { useWorkspace } from "./workspace-context";
import { useRouter } from "next/navigation";
import { MapIcon } from "lucide-react";

export function ProjectMarkers() {
  const { workspaceDirectory, workspaceSlug } = useWorkspace();
  const router = useRouter();
  const projects = workspaceDirectory.teamspaces.flatMap((ts) =>
    ts.projects.flatMap((p) => p),
  );

  return projects.map((p) => (
    <Marker
      key={p.id}
      longitude={p.center.coordinates[0]}
      latitude={p.center.coordinates[1]}
      onClick={() => {
        router.push(`/app/${workspaceSlug}/${p.id}?v=${p.views[0]!.id}`);
      }}
    >
      <div className="absolute bottom-0 left-0 -translate-x-1/2 cursor-pointer">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-medium shadow-md">
          {p.icon ? <span>{p.icon}</span> : <MapIcon className="size-4" />}
          <span>{p.name || "New Map"}</span>
        </div>
        <svg
          className="mx-auto -mt-1 drop-shadow-sm"
          width="24"
          height="10"
          viewBox="0 0 24 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0 C6 0, 8 10, 12 10 C16 10, 18 0, 24 0 Z" fill="white" />
        </svg>
      </div>
    </Marker>
  ));
}
