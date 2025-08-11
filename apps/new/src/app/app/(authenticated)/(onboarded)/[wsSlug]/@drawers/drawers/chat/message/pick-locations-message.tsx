import { useRef } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import { FeatureList } from "~/components/feature-list";
import type { AIResultLocation } from "~/lib/types";
import { useParamsContext } from "~/lib/params/client";

interface PickLocationsMessageProps {
  results: AIResultLocation[];
}

export function PickLocationsMessage({ results }: PickLocationsMessageProps) {
  // const map = useMap();
  // const { setQueryStates } = useParamsContext();
  // const hasFlownToRef = useRef<string | null>(null);
  console.log(22222, results);

  return (
    <div>
      {results.map((r) => (
        <Marker
          key={r.id}
          longitude={r.coordinates[0]}
          latitude={r.coordinates[1]}
          anchor="center"
        />
      ))}
      <FeatureList
        features={[
          ...results.map((r) => ({
            id: r.id,
            name: r.name ?? "",
            description: r.description ?? "",
            coordinates: r.coordinates,
          })),
        ]}
        onClick={() => {}}
      />
    </div>
  );
}
