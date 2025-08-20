import { useRef, useEffect, useState } from "react";
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
    source: result.source,
  };
}

export function PickLocationsMessage({ results }: PickLocationsMessageProps) {
  const { current: map } = useMap();
  const { setQueryStates, params } = useParamsContext();
  const hasFlownToRef = useRef<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<AIResultLocation | null>(
    null,
  );
  const activeFeatureId = params.geoapifyPlaceId ?? params.rowId;

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

  const handleFeatureClick = async (feature: AIResultLocation) => {
    if (feature.source === "geoapify") {
      await setQueryStates({
        geoapifyPlaceId: feature.id,
      });
    } else if (feature.source === "mapform") {
      await setQueryStates({
        rowId: feature.id,
      });
    }
  };

  const handleFeatureHover = (feature: AIResultLocation | null) => {
    setHoveredFeature(feature);
  };

  return (
    <div>
      {results.map((r) => {
        const isHovered = hoveredFeature?.id === r.id;

        // The marker will be display by the Drawer component
        if (r.id === activeFeatureId) return null;

        return (
          <Marker
            key={`${r.id}-${isHovered ? "hover" : "rest"}`}
            longitude={r.coordinates[0]}
            latitude={r.coordinates[1]}
            anchor="center"
            onClick={() => handleFeatureClick(r)}
            style={{
              cursor: "pointer",
            }}
          />
        );
      })}
      <FeatureList
        features={results.map((r) => FeatureWithImage({ result: r }))}
        onHover={handleFeatureHover}
        onClick={handleFeatureClick}
      />
    </div>
  );
}
