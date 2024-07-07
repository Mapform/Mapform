import { useMemo } from "react";
import type { CircleLayer } from "react-map-gl";
import { Source, Layer } from "react-map-gl";
import type { FeatureCollection } from "geojson";

interface DataProps {
  points: { id: number; latitude: number; longitude: number }[];
}

export function Data({ points }: DataProps) {
  const geojson: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          id: point.id,
        },
      })),
    }),
    [points]
  );

  // TODO: Can allow customization of the layer style
  const layerStyle: CircleLayer = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };

  return (
    <Source data={geojson} id="my-data" type="geojson">
      <Layer {...layerStyle} />
    </Source>
  );
}
