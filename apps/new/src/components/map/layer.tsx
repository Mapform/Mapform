import { useEffect } from "react";
import type { AnyLayer, Layer as MapboxLayer } from "mapbox-gl";
import { useMap } from "./index";
import { useSource } from "./source";

interface LayerProps extends Omit<MapboxLayer, "id" | "source"> {
  id: string;
  source?: string;
  beforeId?: string;
}

export const Layer = ({
  id,
  source: sourceProp,
  beforeId,
  ...layerProps
}: LayerProps) => {
  const { map } = useMap();
  const { sourceId } = useSource();
  const source = sourceProp ?? sourceId;

  useEffect(() => {
    if (!map) return;

    const handleSourceData = (e: mapboxgl.MapSourceDataEvent) => {
      if (e.sourceId === source && e.isSourceLoaded) {
        // Check if layer already exists
        if (map.getLayer(id)) {
          // Remove existing layer to update it
          map.removeLayer(id);
        }

        // Add new layer
        map.addLayer(
          {
            id,
            source,
            ...layerProps,
          } as AnyLayer,
          beforeId,
        );
      }
    };

    // Add event listener for source data
    map.on("sourcedata", handleSourceData);

    // If source is already loaded, add the layer immediately
    const mapSource = map.getSource(source);
    if (map.isStyleLoaded() && mapSource) {
      handleSourceData({
        sourceId: source,
        isSourceLoaded: true,
      } as mapboxgl.MapSourceDataEvent);
    }

    return () => {
      map.off("sourcedata", handleSourceData);
      if (map.isStyleLoaded() && map.getLayer(id)) {
        map.removeLayer(id);
      }
    };
  }, [map, id, source, beforeId, layerProps]);

  return null;
};
