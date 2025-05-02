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
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import StaticMode from "@mapbox/mapbox-gl-draw-static-mode";
import { useMapform } from "../index";
import { LocationMarker } from "../../location-marker";
import { Cluster } from "./cluster";
import { useDrawFeatures } from "~/lib/map-tools/draw-features";
import { useProject } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/[tsSlug]/projects/[pId]/project-context";
import type { GetLayerFeature } from "@mapform/backend/data/datalayer/get-layer-feature";
import { mapStyles } from "./map-styles";
import "./style.css";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  pageData?: GetPageData["data"];
  isEditing?: boolean;
  mapPadding: ViewState["padding"];
  initialViewState: ViewState;
  children?: React.ReactNode;
  isMobile?: boolean;
  isStatic?: boolean;
  selectedFeature?: GetLayerFeature["data"];
}

interface MarkerPointFeature {
  id: string;
  cluster: boolean;
  icon: string;
  color: string;
  rowId: string;
  columnId: string;
  layerId: string;
  pointLayerId: string;
  point_count: number;
  features: { icon: string; color: string }[] | undefined;
}

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
  isStatic = true,
  selectedFeature,
}: MapProps) {
  const { updatePageDataServerAction } = useProject();
  const setQueryString = useSetQueryString();
  const [bounds, setBounds] = useState<
    [number, number, number, number] | undefined
  >(undefined);
  const [zoom, setZoom] = useState<number>(initialViewState.zoom);
  const {
    draw,
    map,
    setMap,
    setDraw,
    mapContainer,
    mapContainerBounds,
    activeFeature,
    setActiveFeature,
  } = useMapform();
  // Condition in usePrevious resolves issue where map padding is not updated on first render
  const prevMapPadding = usePrevious(map ? mapPadding : undefined);

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
          columnId: feature.columnId,
          icon: feature.icon,
          layerId: feature.layerId,
          pointLayerId: feature.pointLayerId,
          cluster: false,
        },
      })),
    }),
    [pageData?.markerData],
  );

  const mapClusterItems = useCallback(
    (item: MarkerPointFeature) => ({
      icon: item.icon,
      color: item.color,
      rowId: item.rowId,
      layerId: item.layerId,
      columnId: item.columnId,
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

        const modes = MapboxDraw.modes;
        // @ts-expect-error -- This is the recommended way to set the new mode
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        modes.static = StaticMode;
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          // @ts-expect-error -- This is the recommended way to set the new mode
          modes,
          defaultMode: isStatic ? "static" : "simple_select",
          styles: mapStyles,
          userProperties: true,
          // Disable multiselect with shift + click, and instead zooms to area
          boxSelect: false,
        });
        m.addControl(draw);
        setDraw(draw);
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
          value: `${feature.properties.rowId}_${feature.properties.layerId}`,
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

  useEffect(() => {
    if (!map || !draw) return;

    const handleDrawCreate = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      console.log("handleDrawCreate", e);
      const feature = e.features[0];

      if (!feature) return;

      setActiveFeature(feature);
    };

    const handleDrawUpdate = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      console.log("handleDrawUpdate", e);
      const feature = e.features[0];

      if (!feature) return;

      if (!feature.properties?.persisted) {
        setActiveFeature(feature);
        return;
      }

      if (feature.geometry.type === "Polygon") {
        updatePageDataServerAction.execute({
          type: "polygon",
          value: { coordinates: feature.geometry.coordinates },
          rowId: feature.properties?.rowId,
          columnId: feature.properties?.columnId,
        });
      }

      if (feature.geometry.type === "LineString") {
        updatePageDataServerAction.execute({
          type: "line",
          value: { coordinates: feature.geometry.coordinates },
          rowId: feature.properties?.rowId,
          columnId: feature.properties?.columnId,
        });
      }

      if (feature.geometry.type === "Point") {
        updatePageDataServerAction.execute({
          type: "point",
          value: {
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1],
          },
          rowId: feature.properties?.rowId,
          columnId: feature.properties?.columnId,
        });
      }
    };

    const handleDrawSelectionChange = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      const eventFeature = e.features[e.features.length - 1];

      if (activeFeature !== null && eventFeature?.id !== activeFeature.id) {
        setActiveFeature(null);
        try {
          draw.delete(activeFeature.id as string);
        } catch (_) {
          // Do nothing
        }
      }

      // This is used to prevent multi select (default of MapboxDraw). We
      // essentially always want to force only one feature to be selected
      if (eventFeature && e.features.length > 1) {
        try {
          draw.changeMode("simple_select", {
            featureIds: [eventFeature.id as string],
          });
        } catch (_) {
          // Do nothing
        }
      }

      if (eventFeature?.properties?.persisted) {
        setQueryString({
          key: "feature",
          value: `${eventFeature.properties.rowId}_${eventFeature.properties.layerId}`,
        });
      } else if (e.features.length === 0) {
        setQueryString({
          key: "feature",
          value: null,
        });
      }
    };

    map.on("draw.create", handleDrawCreate);
    map.on("draw.update", handleDrawUpdate);
    map.on("draw.selectionchange", handleDrawSelectionChange);

    return () => {
      map.off("draw.create", handleDrawCreate);
      map.off("draw.update", handleDrawUpdate);
      map.off("draw.selectionchange", handleDrawSelectionChange);
    };
  }, [
    map,
    draw,
    setActiveFeature,
    activeFeature,
    updatePageDataServerAction,
    setQueryString,
  ]);

  // Used to select the feature on the map
  useEffect(() => {
    if (selectedFeature) {
      draw?.changeMode("simple_select", {
        featureIds: [selectedFeature.feature?.id as string],
      });
    } else {
      draw?.changeMode("simple_select", {
        featureIds: [],
      });
    }
  }, [selectedFeature, draw]);

  useDrawFeatures({
    map,
    featureCollection: {
      type: "FeatureCollection",
      features: [
        // LINES
        ...(pageData?.lineData.map((feature) => ({
          type: "Feature" as const,
          properties: {
            rowId: feature.rowId,
            columnId: feature.columnId,
            layerId: feature.layerId,
            persisted: true,
            color: feature.color ?? "#3b82f6",
          },
          geometry: {
            coordinates:
              (feature.value?.coordinates as unknown as Position[]) ?? [],
            type: "LineString" as const,
          },
          id: feature.id,
        })) ?? []),

        // POLYGONS
        ...(pageData?.polygonData.map((feature) => ({
          type: "Feature" as const,
          properties: {
            rowId: feature.rowId,
            columnId: feature.columnId,
            layerId: feature.layerId,
            persisted: true,
            color: feature.color ?? "#3b82f6",
          },
          geometry: {
            coordinates: (feature.value
              ?.coordinates as unknown as Position[][]) ?? [[[]]],
            type: "Polygon" as const,
          },
          id: feature.id,
        })) ?? []),

        // POINTS
        ...(pageData?.pointData.map((feature) => ({
          type: "Feature" as const,
          properties: {
            rowId: feature.rowId,
            columnId: feature.columnId,
            layerId: feature.layerId,
            persisted: true,
            color: feature.color ?? "#3b82f6",
          },
          geometry: {
            coordinates: [feature.value!.x, feature.value!.y],
            type: "Point" as const,
          },
          id: feature.id,
        })) ?? []),
      ],
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
              markerOptions={{
                draggable: !isStatic,
              }}
              onDragEnd={(lngLat) => {
                updatePageDataServerAction.execute({
                  type: "point",
                  value: { x: lngLat.lng, y: lngLat.lat },
                  rowId: cluster.properties.rowId,
                  columnId: cluster.properties.columnId,
                });
              }}
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
                    value: `${cluster.properties.rowId}_${cluster.properties.layerId}`,
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
