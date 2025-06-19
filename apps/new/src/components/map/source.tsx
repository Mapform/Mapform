import { useEffect, createContext, useContext } from "react";
import type { GeoJSONSourceRaw } from "mapbox-gl";
import { useMap } from "./index";

interface SourceContextProps {
  sourceId: string;
}

export const SourceContext = createContext<SourceContextProps>(
  {} as SourceContextProps,
);
export const useSource = () => useContext(SourceContext);

interface SourceProps {
  id: string;
  data: GeoJSONSourceRaw["data"];
  type?: "geojson" | "vector" | "raster" | "image" | "video";
  children?: React.ReactNode;
}

export const Source = ({
  id,
  data,
  type = "geojson",
  children,
}: SourceProps) => {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    // Check if source already exists
    if (map.getSource(id)) {
      // Update existing source
      (map.getSource(id) as mapboxgl.GeoJSONSource).setData(
        data as GeoJSON.FeatureCollection,
      );
    } else {
      // Add new source
      map.addSource(id, {
        type,
        data,
      });
    }

    return () => {
      if (map.isStyleLoaded() && map.getSource(id)) {
        // Reference: https://github.com/visgl/react-map-gl/blob/master/modules/react-mapbox/src/components/source.ts
        // Parent effects are destroyed before child ones, see
        // https://github.com/facebook/react/issues/16728
        // Source can only be removed after all child layers are removed
        const allLayers = map.getStyle().layers;
        for (const layer of allLayers) {
          // @ts-expect-error -- source does not exist on all layer types
          if (map.isStyleLoaded() && layer.source === id) {
            map.removeLayer(layer.id);
          }
        }
        map.removeSource(id);
      }
    };
  }, [map, id, data, type]);

  return (
    <SourceContext.Provider value={{ sourceId: id }}>
      {children}
    </SourceContext.Provider>
  );
};
