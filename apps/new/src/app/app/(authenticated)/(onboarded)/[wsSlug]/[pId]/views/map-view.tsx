import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../context";
import { useMap } from "react-map-gl/mapbox";
import { FeatureList } from "~/components/feature-list";

export function MapView() {
  const map = useMap();
  const { projectService } = useProject();
  const { setQueryStates } = useParamsContext();

  const features = projectService.optimisticState.rows.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    icon: row.icon ?? undefined,
    coordinates: row.center.coordinates as [number, number],
    image: row.blobs[0]?.url ? { url: row.blobs[0].url } : undefined,
  }));

  const handleFeatureClick = (feature: {
    id: string;
    coordinates: [number, number];
  }) => {
    void setQueryStates({ rowId: feature.id });

    map.current?.flyTo({
      center: feature.coordinates,
      duration: 1000,
    });
  };

  if (!features.length) {
    return null;
  }

  return <FeatureList features={features} onClick={handleFeatureClick} />;
}
