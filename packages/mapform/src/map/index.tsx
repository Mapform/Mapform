/* eslint-disable import/no-named-as-default-member -- It's cool yo */
import { useEffect, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FeatureCollection } from "geojson";
import type { PageData, ViewState } from "@mapform/map-utils/types";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { usePrevious } from "@mapform/lib/hooks/use-previous";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import { useMapform } from "../context";
import { SearchLocationMarker } from "./search-location-marker";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

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
  const setQueryString = useSetQueryString();
  const { map, setMap } = useMapform();
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
          type: "point",
          color: point.color ?? "#3b82f6",
          rowId: point.rowId,
          pointLayerId: point.pointLayerId,
          // icon: "...",
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
        // const img = new Image(20, 20);
        // img.src = globeSvg.src;
        // img.onload = () => {
        //   m.addImage("cafe", img);
        // };
        setMap(m);
        onLoad && onLoad();
      });

      // Clean up on unmount
      return () => {
        m.remove();
        setMap(undefined);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Just run on initial render
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
            "circle-radius": 8,
            "circle-color": ["get", "color"],
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 2,
          },
        });

        map.on("click", "points", (e) => {
          const feature = e.features?.[0];

          if (feature) {
            setQueryString({
              key: "layer_point",
              value: `${feature.properties.rowId}_${feature.properties.pointLayerId}`,
            });

            // setActivePoint({
            //   id: feature.properties?.id,
            //   color: feature.properties?.color,
            //   title: "Title",
            //   description: "Description",
            // });
          }
        });

        // map.addLayer({
        //   id: "emoji-layer",
        //   type: "symbol",
        //   source: "points",
        //   layout: {
        //     "icon-image": "cafe",
        //     "icon-size": 0.5,
        //   },
        // });
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

export { SearchLocationMarker };
