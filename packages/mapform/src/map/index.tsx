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
  onLoad?: () => void;
  initialViewState: ViewState;
  marker?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * TODO:
 * 1. Add ability to add markers
 * 2. Style points a bit better
 * 3. Add zIndex to points according to layer order
 */
export function Map({
  initialViewState,
  editable = false,
  points = [],
  onLoad,
  marker,
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

    /**
     * Configure the map object and set it in context
     */
    if (mapContainer.current) {
      // Create map with initial state
      const m = new mapboxgl.Map({
        container: mapContainer.current,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: initialViewState.pitch,
        bearing: initialViewState.bearing,
        maxZoom: 20,
        logoPosition: "bottom-right",
        fitBoundsOptions: {
          padding: { top: 10, bottom: 25, left: 800, right: 5 },
        },
      });

      m.setPadding({
        top: 0,
        bottom: 0,
        left: 360,
        right: 0,
      });

      // Add zoom controls
      m.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add your custom markers and lines here
      m.on("load", () => {
        setMap(m);
        onLoad && onLoad();
      });

      // Clean up on unmount
      return () => {
        m.remove();
        setMap(undefined);
      };
    }
  }, []);

  /**
   * Update layers
   */
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

  /**
   * Update marker
   */
  useEffect(() => {
    if (map && marker) {
      const el = document.createElement("div");
      el.className = "marker";

      new mapboxgl.Marker()
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map);
      // new mapboxgl.Marker(el)
      //   .setLngLat([marker.longitude, marker.latitude])
      //   .addTo(map);
    }

    // Remove marker if marker is null
    if (map && !marker) {
      const el = document.querySelector(".marker");
      el && el.remove();
    }
  }, [map, marker]);

  return (
    <div
      className={cn("flex-1", {
        "rounded-md": editable,
      })}
      ref={mapContainer}
    />
  );
}
