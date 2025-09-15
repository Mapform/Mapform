import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../context";
import { FeatureList } from "~/components/feature-list";

export function MapView() {
  const { projectService } = useProject();
  const { setQueryStates } = useParamsContext();

  const features = projectService.optimisticState.rows.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    icon: row.icon ?? undefined,
    coordinates: row.center.coordinates as [number, number],
    image: row.blobs[0]?.url ? { url: row.blobs[0].url } : undefined,
    source: "mapform" as const,
  }));

  const handleFeatureClick = (feature: {
    id: string;
    coordinates: [number, number];
  }) => {
    void setQueryStates({
      rowId: feature.id,
      location: null,
      zoom: null,
      pitch: null,
      bearing: null,
    });
  };

  return <FeatureList features={features} onClick={handleFeatureClick} />;
}
