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
import type { PageData, ViewState } from "@mapform/map-utils/types";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import ReactDOM from "react-dom";
import type { CustomBlock } from "@mapform/blocknote";
import { usePrevious } from "@mapform/lib/hooks/use-previous";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export type MBMap = mapboxgl.Map;

interface MapProviderContextProps {
  map?: MBMap;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
}

export const MapProviderContext = createContext<MapProviderContextProps>(
  {} as MapProviderContextProps,
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
  pageData?: PageData;
  editable?: boolean;
  mapPadding: ViewState["padding"];
  onLoad?: () => void;
  initialViewState: ViewState;
  children?: React.ReactNode;
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
  mapPadding,
  pageData,
  onLoad,
  children,
}: MapProps) {
  // const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useMap();
  // Condition in usePrevious resolves issue where map padding is not updated on first render
  const prevMapPadding = usePrevious(map ? mapPadding : undefined);
  const { ref: mapContainer, bounds } = useMeasure<HTMLDivElement>();

  const geojson: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: (pageData?.pointData ?? []).map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.value.x, point.value.y],
        },
        properties: {
          id: point.id,
        },
      })),
    }),
    [pageData],
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
        // We override the internal resize observer because we are using our own
        trackResize: false,
        // fitBoundsOptions: {
        //   padding: { top: 10, bottom: 25, left: 800, right: 5 },
        // },
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

  useEffect(() => {
    if (map && JSON.stringify(prevMapPadding) !== JSON.stringify(mapPadding)) {
      map.easeTo({
        padding: mapPadding,
        duration: 750,
      });
    }
  }, [map, mapPadding, prevMapPadding]);

  useEffect(() => {
    if (map) {
      map.resize();
    }
  }, [map, bounds]);

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

  return (
    <div
      className={cn("flex-1", {
        "rounded-md": editable,
      })}
      ref={mapContainer}
    >
      {children}
    </div>
  );
}

/**
 * Update searchLocationMarker marker
 */
export function SearchLocationMarker({
  searchLocationMarker,
  children,
}: {
  searchLocationMarker: {
    latitude: number;
    longitude: number;
    name: string;
    description?: {
      content: CustomBlock[];
    };
  } | null;
  children: React.ReactNode;
}) {
  const { map } = useMap();
  const markerEl = useRef<mapboxgl.Marker | null>(null);
  const markerElInner = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const currentLngLat = markerEl.current?.getLngLat();
    if (
      map &&
      searchLocationMarker &&
      currentLngLat?.lat !== searchLocationMarker.latitude &&
      currentLngLat?.lng !== searchLocationMarker.longitude
    ) {
      ReactDOM.render(<>{children}</>, markerElInner.current);
      markerEl.current?.remove();
      markerEl.current = new mapboxgl.Marker(markerElInner.current)
        .setLngLat([
          searchLocationMarker.longitude,
          searchLocationMarker.latitude,
        ])
        .addTo(map);
    }

    if (map && !searchLocationMarker) {
      markerEl.current?.remove();
    }
  }, [map, searchLocationMarker, children]);

  return null;
}
