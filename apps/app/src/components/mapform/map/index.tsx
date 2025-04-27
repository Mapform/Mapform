import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FeatureCollection, Position } from "geojson";
import type { ViewState } from "@mapform/map-utils/types";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import { usePrevious } from "@mapform/lib/hooks/use-previous";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import type Supercluster from "supercluster";
import useSupercluster from "use-supercluster";
import { AnimatePresence, motion } from "motion/react";
import { useDrawPoints } from "~/lib/map-tools/points";
import { useDrawLines } from "~/lib/map-tools/lines";
import { useDrawShapes } from "~/lib/map-tools/polygons";
import { useMapform } from "../index";
import { LocationMarker } from "../../location-marker";
import { Cluster } from "./cluster";
import "./style.css";
import { usePolygons } from "~/lib/map-tools/polygons-draw";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  pageData?: GetPageData["data"];
  isEditing?: boolean;
  mapPadding: ViewState["padding"];
  initialViewState: ViewState;
  children?: React.ReactNode;
  isMobile?: boolean;
}

interface MarkerPointFeature {
  id: string;
  cluster: boolean;
  icon: string;
  color: string;
  rowId: string;
  pointLayerId: string;
  point_count: number;
  features: { icon: string; color: string }[] | undefined;
}

const POINT_LAYER_ID = "points";
const POINT_SOURCE_ID = "points";
const LINE_LAYER_ID = "lines";
const LINE_SOURCE_ID = "lines";
const POLYGON_LAYER_ID = "polygons";
const POLYGON_SOURCE_ID = "polygons";

/**
 * TODO:
 * 1. Add ability to add markers
 * 2. Style points a bit better
 * 3. Add zIndex to points according to layer order
 */
export function Map({
  initialViewState,
  isEditing = false,
  mapPadding,
  pageData,
  children,
  isMobile,
}: MapProps) {
  const setQueryString = useSetQueryString();
  const [bounds, setBounds] = useState<
    [number, number, number, number] | undefined
  >(undefined);
  const [zoom, setZoom] = useState<number>(initialViewState.zoom);
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
          coordinates: [feature.value!.x, feature.value!.y],
        },
        properties: {
          id: feature.id,
          color: feature.color ?? "#3b82f6",
          rowId: feature.rowId,
          icon: feature.icon,
          pointLayerId: feature.pointLayerId,
          cluster: false,
        },
      })),
    }),
    [pageData?.markerData],
  );

  const lineGeojson: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: (pageData?.lineData ?? []).map((feature) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: feature.value!.coordinates.map((coord) => [
            coord[0],
            coord[1],
          ]),
        },
        properties: {
          id: feature.id,
          color: feature.color ?? "#3b82f6",
          rowId: feature.rowId,
          lineLayerId: feature.lineLayerId,
        },
      })),
    }),
    [pageData?.lineData],
  );

  const mapClusterItems = useCallback(
    (item: MarkerPointFeature) => ({
      icon: item.icon,
      color: item.color,
      rowId: item.rowId,
      pointLayerId: item.pointLayerId,
      cluster: item.cluster,
      point_count: item.point_count,
      id: item.id,
      features: undefined,
    }),
    [],
  );
  const reduceClusterItems = useCallback(
    (acc: MarkerPointFeature, cur: MarkerPointFeature) => {
      acc.features = acc.features
        ? [...acc.features, { icon: cur.icon, color: cur.color }]
        : [{ icon: cur.icon, color: cur.color }];
    },
    [],
  );

  const { clusters, supercluster } = useSupercluster({
    points:
      markerGeojson.features as Supercluster.PointFeature<MarkerPointFeature>[],
    bounds,
    zoom,
    options: {
      radius: 100,
      minZoom: 0,
      maxZoom: 20,
      map: mapClusterItems,
      reduce: reduceClusterItems,
    },
  });

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
        scrollZoom: isMobile
          ? false
          : {
              around: "center",
            },
        // We override the internal resize observer because we are using our own
        doubleClickZoom: false,
        trackResize: false,
        logoPosition: isMobile ? "top-left" : "bottom-right",
        attributionControl: !isMobile,
      });

      m.on("dblclick", () => {
        // Prevent the default double-click zoom behavior
        m.doubleClickZoom.disable();

        // Zoom in by increasing the zoom level, preserving the clicked location
        m.zoomTo(m.getZoom() + 1, {
          duration: 300, // Optional: set the animation duration
        });
      });

      // Add zoom controls
      if (isMobile) {
        m.addControl(
          new mapboxgl.AttributionControl({
            compact: true, // Makes the attribution more compact if there's not enough space
          }),
          "top-right",
        );
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Just run on initial render
  }, [isMobile]);

  /**
   * React to drawer padding change
   */
  useEffect(() => {
    if (map && JSON.stringify(prevMapPadding) !== JSON.stringify(mapPadding)) {
      map.easeTo({
        padding: mapPadding,
        duration: 750,
      });
    }
  }, [map, mapPadding, prevMapPadding]);

  /**
   * Resize to window effect
   */
  useEffect(() => {
    if (map) {
      map.resize();
    }
  }, [map, mapContainerBounds]);

  /**
   * Bind event handlers
   */
  useEffect(() => {
    const handleLayerClick = (
      e: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
      } & mapboxgl.EventData,
    ) => {
      const feature = e.features?.[0];

      if (feature?.properties) {
        if (isMobile) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
    const handleBoundsChange = () => {
      if (!map) {
        return;
      }

      const newBounds = map.getBounds().toArray().flat() as [
        number,
        number,
        number,
        number,
      ];

      setBounds(newBounds);
    };
    const handleZoomChange = () => {
      if (!map) {
        return;
      }

      setZoom(map.getZoom());
    };

    if (map) {
      // BIND EVENT HANDLERS
      map.on("click", "points", handleLayerClick);
      map.on("mouseenter", "points", handleMouseEnterPoints);
      map.on("mouseleave", "points", handleMouseLeavePoints);
      map.on("moveend", handleBoundsChange);
      map.on("zoomend", handleZoomChange);
    }

    return () => {
      if (map) {
        // CLEANUP EVENT HANDLERS
        map.off("click", "points", handleLayerClick);
        map.off("mouseenter", "points", handleMouseEnterPoints);
        map.off("mouseleave", "points", handleMouseLeavePoints);
        map.off("moveend", handleBoundsChange);
        map.off("zoomend", handleZoomChange);
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

    // Handle points layer
    const currentPointSource = map.getSource("points") as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentPointSource) {
      // Update the source data
      (currentPointSource as mapboxgl.GeoJSONSource).setData(pointGeojson);
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

    // Handle lines layer
    const currentLineSource = map.getSource("lines") as
      | mapboxgl.AnySourceImpl
      | undefined;

    if (currentLineSource) {
      // Update the source data
      (currentLineSource as mapboxgl.GeoJSONSource).setData(lineGeojson);
    } else {
      // Add a new source and layer
      map.addSource("lines", {
        type: "geojson",
        data: lineGeojson,
      });

      map.addLayer({
        id: "lines",
        type: "line",
        source: "lines",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 5,
          "line-opacity": 0.8,
        },
      });
    }
  }, [map, pointGeojson, lineGeojson]);

  console.log(111, pageData?.polygonData);

  // useDrawShapes({
  //   map,
  //   coordinates: pageData?.polygonData.map(
  //     (feature) =>
  //       (feature.value?.coordinates as unknown as Position[][] | undefined) ??
  //       [],
  //   ) ?? [[[]]],
  //   sourceId: POLYGON_SOURCE_ID,
  //   layerId: POLYGON_LAYER_ID,
  // });

  usePolygons({
    map,
    featureCollection: {
      type: "FeatureCollection",
      features:
        pageData?.polygonData.map((feature) => ({
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: (feature.value
              ?.coordinates as unknown as Position[][]) ?? [[[]]],
            type: "Polygon",
          },
        })) ?? [],
    },
  });

  return (
    <div
      className={cn("relative flex-1 overflow-hidden", {
        "rounded-md": isEditing,
      })}
      ref={mapContainer}
    >
      {/* MARKERS */}
      <AnimatePresence>
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;

          if (!longitude || !latitude) {
            return null;
          }

          if (cluster.properties.cluster) {
            const { point_count: pointCount } = cluster.properties;

            const allFeatures = [
              {
                icon: cluster.properties.icon,
                color: cluster.properties.color,
              },
              ...(cluster.properties.features ?? []),
            ];
            const uniqueFeatures = allFeatures
              .filter(
                (item, index, self) =>
                  index === self.findIndex((obj) => obj.icon === item.icon),
              )
              .filter((item) => item.icon); // Remove any empty icons
            const expansionZoom =
              supercluster &&
              cluster.id &&
              Math.min(
                supercluster.getClusterExpansionZoom(Number(cluster.id)),
                17,
              );

            if (!map) {
              return null;
            }

            return (
              <LocationMarker
                key={cluster.id}
                latitude={latitude}
                longitude={longitude}
                map={map}
              >
                <Cluster
                  onClick={() => {
                    if (!expansionZoom) {
                      return;
                    }

                    map.easeTo({
                      zoom: expansionZoom,
                      center: [longitude, latitude],
                      duration: 750,
                    });
                  }}
                  pointCount={pointCount}
                  uniqueFeatures={uniqueFeatures}
                />
              </LocationMarker>
            );
          }

          if (!map) {
            return null;
          }

          return (
            <LocationMarker
              key={cluster.properties.id}
              latitude={latitude}
              longitude={longitude}
              map={map}
            >
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-lg shadow-md"
                exit={{ opacity: 0, y: 20 }}
                initial={{ opacity: 0, y: -20 }}
                onClick={() => {
                  // TODO: It might make sense to de-couple this from the map
                  // and isntead pass an onClick callback. The parent can do
                  // this.
                  if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
                  setQueryString({
                    key: "feature",
                    value: `marker_${cluster.properties.rowId}_${cluster.properties.pointLayerId}`,
                  });
                }}
                style={{ backgroundColor: cluster.properties.color }}
                type="button"
              >
                {cluster.properties.icon}
              </motion.button>
            </LocationMarker>
          );
        })}
      </AnimatePresence>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 transition-all duration-[250]",
        )}
        style={mapPadding}
      >
        {children}
      </div>
    </div>
  );
}

export { LocationMarker };
