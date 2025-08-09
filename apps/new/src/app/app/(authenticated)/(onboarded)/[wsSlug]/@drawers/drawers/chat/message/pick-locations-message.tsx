import { useRef } from "react";
import { useMap } from "react-map-gl/mapbox";
import { useParamsContext } from "~/lib/params/client";

interface PickLocationsMessageProps {
  relevantPlaces: {
    id: string;
    name: string;
    description?: string | undefined;
    wikidata?: string | undefined;
  }[];
}

export function PickLocationsMessage({
  relevantPlaces,
}: PickLocationsMessageProps) {
  // const map = useMap();
  // const { setQueryStates } = useParamsContext();
  // const hasFlownToRef = useRef<string | null>(null);

  return (
    <div>
      {relevantPlaces?.map((r) => (
        <div key={r.id}>
          <h3>{r.name}</h3>
          <p>{r.description}</p>
        </div>
      ))}
    </div>
  );
}
