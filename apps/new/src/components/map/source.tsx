import { useEffect, createContext, useContext } from "react";
import { useMap } from "./index";
import { loadPointImage } from "~/lib/map/point-image-utils";

interface SourceContextProps {
  sourceId: string;
}

export const SourceContext = createContext<SourceContextProps>(
  {} as SourceContextProps,
);
export const useSource = () => useContext(SourceContext);

interface SourceProps {
  id: string;
  data: GeoJSON.FeatureCollection;
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

  /**
   * Configure source when data changes
   */
  useEffect(() => {
    if (!map) return;

    // Check if source already exists
    if (map.getSource(id)) {
      // Update existing source
      (map.getSource(id) as mapboxgl.GeoJSONSource).setData(data);
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
  }, [data]);

  /**
   * Handle loading images for points
   */
  useEffect(() => {
    if (!map) return;

    const loadPointImages = async () => {
      const uniqueIcons = new Set<{
        icon: string | undefined;
        color: string | undefined;
      }>();
      data.features.forEach((feature) => {
        const icon = feature.properties?.icon;
        const color = undefined;

        uniqueIcons.add({ icon, color });
      });

      for (const { icon, color } of uniqueIcons) {
        const imageId = getImageId(icon, color);

        console.log("imageId", imageId);

        if (!map.hasImage(imageId)) {
          await loadPointImage(map, icon, color);
        }
      }
    };

    void loadPointImages();
  }, [data]);

  return (
    <SourceContext.Provider value={{ sourceId: id }}>
      {children}
    </SourceContext.Provider>
  );
};

export function getImageId(
  icon: string | undefined,
  color: string | undefined,
) {
  return `image-${icon || "none"}-${color || "none"}`;
}
