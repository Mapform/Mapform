import { useRef } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import { FeatureList } from "~/components/feature-list";
import type { AIResultLocation } from "~/lib/types";
import { useParamsContext } from "~/lib/params/client";
import { useWikidataImages } from "~/lib/wikidata-image";

interface PickLocationsMessageProps {
  results: AIResultLocation[];
}

// Component to handle a single feature with Wikidata image
function FeatureWithImage({ result }: { result: AIResultLocation }) {
  const wikidataData = useWikidataImages(result.wikidata);

  return {
    id: result.id,
    name: result.name ?? "",
    description: result.description ?? "",
    coordinates: result.coordinates,
    image: result.wikidata
      ? {
          url: wikidataData.primaryImage?.imageUrl ?? "",
          isLoading: wikidataData.isLoading,
        }
      : undefined,
  };
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
        features={results.map((r) => FeatureWithImage({ result: r }))}
        onClick={() => {}}
      />
    </div>
  );
}
