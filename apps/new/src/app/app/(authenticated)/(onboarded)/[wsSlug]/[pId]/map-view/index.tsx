"use client";

import { Layer, Map, MapRoot, Source } from "~/components/map";
import { rowsToGeoJSON } from "~/lib/rows-to-geojson";
import { Header } from "../header";
import { useProject } from "../context";

export function MapView() {
  const { project } = useProject();
  console.log(project.rows);

  return (
    <MapRoot>
      <div className="relative h-full">
        <Map className="size-full rounded-lg">
          <Source id="geojson-source" data={rowsToGeoJSON(project.rows)}>
            <Layer id="geojson-layer" type="fill" />
          </Source>
        </Map>
        <Header className="absolute left-4 top-4 z-10 w-fit p-4" />
      </div>
    </MapRoot>
  );
}
