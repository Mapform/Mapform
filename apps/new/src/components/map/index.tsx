import { useMeasure } from "@mapform/lib/hooks/use-measure";
import mapboxgl from "mapbox-gl";
import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import { env } from "~/env.mjs";
import { Source } from "./source";
import { Layer } from "./layer";

interface MapformProps {
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  children: React.ReactNode;
}

interface MapContextProps {
  map?: mapboxgl.Map;
  setMap: Dispatch<SetStateAction<mapboxgl.Map | undefined>>;
  mapBounds: DOMRectReadOnly | undefined;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export const MapContext = createContext<MapContextProps>({} as MapContextProps);
export const useMap = () => useContext(MapContext);

const accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function MapRoot({ children, padding }: MapformProps) {
  const [map, setMap] = useState<mapboxgl.Map>();
  const { ref: mapContainer, bounds: mapBounds } = useMeasure<HTMLDivElement>();

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        mapBounds,
        mapContainer,
        padding,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const Map = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const { map, mapContainer, setMap, padding } = useMap();

  useEffect(() => {
    if (!mapContainer.current || map) return;

    mapboxgl.accessToken = accessToken;

    const instance = new mapboxgl.Map({
      container: mapContainer.current,
    });

    instance.on("load", () => {
      setMap(instance);
    });

    return () => {
      instance.remove();
    };
  }, []);

  /**
   * React to drawer padding change
   */
  useEffect(() => {
    if (!map) return;

    map.easeTo({
      padding,
      duration: 500,
    });
  }, [map, padding]);

  return (
    <div ref={mapContainer} className={className}>
      {children}
    </div>
  );
};

export { Source, Layer };
