/* eslint-disable import/no-named-as-default-member -- It's cool yo */
import {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
} from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FeatureCollection } from "geojson";
import type { Points, ViewState } from "@mapform/map-utils/types";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export type MBMap = mapboxgl.Map;

interface MapProviderContextProps {
  map?: MBMap;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
}

export const MapProviderContext = createContext<MapProviderContextProps>(
  {} as MapProviderContextProps
);
export const useMap = () => useContext(MapProviderContext);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<MBMap>();

  return (
    <MapProviderContext.Provider
      value={{
        map,
        setMap,
      }}
    >
      {children}
    </MapProviderContext.Provider>
  );
}

interface MapProps {
  points?: Points;
  editable?: boolean;
  initialViewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState | null>>;
}

/**
 * TODO:
 * 1. Add overlays accoriding to https://github.com/mapbox/mapbox-react-examples/blob/master/data-overlay/src/Map.js
 * 2. Add ability to add markers
 */
export function Map({
  initialViewState,
  editable = false,
  points = [],
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useMap();

  const geojson: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          id: point.id,
        },
      })),
    }),
    [points]
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    if (mapContainer.current) {
      // Create map with initial state
      const m = new mapboxgl.Map({
        container: mapContainer.current,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: initialViewState.pitch,
        bearing: initialViewState.bearing,
        maxZoom: 20,
      });

      // Add zoom controls
      m.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add your custom markers and lines here
      m.on("load", () => {
        setMap(m);
      });

      // Clean up on unmount
      return () => {
        m.remove();
        setMap(undefined);
      };
    }
  }, []);

  useEffect(() => {
    if (map) {
      const currentSource = map.getSource("points") as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentSource) {
        // Update the source data
        (currentSource as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        // Add a new source and layer
        map.addSource("points", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "points",
          type: "circle",
          source: "points",
          paint: {
            "circle-radius": 10,
            "circle-color": "#007cbf",
          },
        });
      }
    }
  }, [map, geojson]);

  return (
    <div
      className={cn("flex-1", {
        "rounded-md": editable,
      })}
      ref={mapContainer}
    />
  );
}
