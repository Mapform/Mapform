import { useRef, useEffect } from "react";
import { Marker, useMap } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
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
  const { current: map } = useMap();
  const { setQueryStates } = useParamsContext();
  const hasFlownToRef = useRef<string | null>(null);

  // Fit map to results bounds when component mounts
  useEffect(() => {
    if (!map || !results.length || hasFlownToRef.current) return;

    const bounds = new mapboxgl.LngLatBounds();

    results.forEach((result) => {
      bounds.extend(result.coordinates);
    });

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });

    hasFlownToRef.current = "flown";
  }, [map, results]);

  const handleFeatureClick = (feature: AIResultLocation) => {};

  const handleFeatureHover = (feature: AIResultLocation) => {
    if (!map) return;

    map.easeTo({
      center: feature.coordinates,
      zoom: 14,
      duration: 1000,
      // easing: (t) => t * (2 - t), // ease-out
    });
  };

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
        onHover={handleFeatureHover}
      />
    </div>
  );
}
