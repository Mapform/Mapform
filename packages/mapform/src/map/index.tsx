/* eslint-disable import/no-named-as-default-member -- It's cool yo */
import { useEffect, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FeatureCollection } from "geojson";
import type { ViewState } from "@mapform/map-utils/types";
import type { PageData } from "@mapform/backend/datalayer/get-page-data";
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
  isMobile?: boolean;
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
  isMobile,
}: MapProps) {
  const setQueryString = useSetQueryString();
  const { map, setMap, mapContainer, mapContainerBounds } = useMapform();
  // Condition in usePrevious resolves issue where map padding is not updated on first render
  const prevMapPadding = usePrevious(map ? mapPadding : undefined);

  const pointGeojson = useMemo(
    () => ({
      type: "FeatureCollection",
      features: (pageData?.pointData ?? []).map((feature) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know it's not null
          coordinates: [feature.value!.x, feature.value!.y],
        },
        properties: {
          id: feature.id,
          color: feature.color ?? "#3b82f6",
          rowId: feature.rowId,
          pointLayerId: feature.pointLayerId,
        },
      })),
    }),
    [pageData?.pointData],
  ) satisfies FeatureCollection;

  const markerGeojson: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: (pageData?.markerData ?? []).map((feature) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know it's not null
          coordinates: [feature.value!.x, feature.value!.y],
        },
        properties: {
          id: feature.id,
          color: feature.color ?? "#3b82f6",
          rowId: feature.rowId,
          icon: feature.icon,
          pointLayerId: feature.pointLayerId,
        },
      })),
    }),
    [pageData?.markerData],
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
        scrollZoom: !isMobile,
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
  }, [map, mapContainerBounds]);

  /**
   * BIND EVENT HANDLERS
   */
  useEffect(() => {
    const handleLayerClick = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
      } & mapboxgl.EventData,
    ) => {
      const feature = e.features?.[0];

      if (feature?.properties) {
        isMobile && window.scrollTo({ top: 0, behavior: "smooth" });
        setQueryString({
          key: "feature",
          value: `point_${feature.properties.rowId}_${feature.properties.pointLayerId}`,
        });
      }
    };
    const handleMouseEnterPoints = () => {
      map && (map.getCanvas().style.cursor = "pointer");
    };
    const handleMouseLeavePoints = () => {
      map && (map.getCanvas().style.cursor = "");
    };

    if (map) {
      // BIND EVENT HANDLERS
      map.on("click", "points", handleLayerClick);
      map.on("mouseenter", "points", handleMouseEnterPoints);
      map.on("mouseleave", "points", handleMouseLeavePoints);
    }

    return () => {
      if (map) {
        map.off("click", "points", handleLayerClick);
        map.off("mouseenter", "points", handleMouseEnterPoints);
        map.off("mouseleave", "points", handleMouseLeavePoints);
      }
    };
  }, [map, setQueryString, isMobile]);

  /**
   * ADD LAYERS
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const currentSource = map.getSource("points") as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentSource) {
      // Update the source data
      (currentSource as mapboxgl.GeoJSONSource).setData(pointGeojson);
    } else {
      // Add a new source and layer
      map.addSource("points", {
        type: "geojson",
        data: pointGeojson,
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
    }
  }, [map, pointGeojson]);

  return (
    <div
      className={cn("relative flex-1 overflow-hidden", {
        "rounded-md": editable,
      })}
      ref={mapContainer}
    >
      {/* MARKERS */}
      {markerGeojson.features.map((feature) => (
        <SearchLocationMarker
          key={feature.properties?.id}
          searchLocationMarker={{
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
            icon: "city",
          }}
        >
          <button
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-lg shadow-md"
            onClick={() => {
              isMobile && window.scrollTo({ top: 0, behavior: "smooth" });
              setQueryString({
                key: "feature",
                value: `marker_${feature.properties.rowId}_${feature.properties.pointLayerId}`,
              });
            }}
            style={{ backgroundColor: feature.properties?.color }}
            type="button"
          >
            {feature.properties?.icon}
          </button>
        </SearchLocationMarker>
      ))}
      {children}
    </div>
  );
}

export { SearchLocationMarker };
