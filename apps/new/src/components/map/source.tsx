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
      if (map.getSource(id)) {
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
