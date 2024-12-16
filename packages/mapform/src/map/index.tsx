import { useCallback, useEffect, useMemo, useState } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FeatureCollection } from "geojson";
import type { ViewState } from "@mapform/map-utils/types";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import { usePrevious } from "@mapform/lib/hooks/use-previous";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import type Supercluster from "supercluster";
import useSupercluster from "use-supercluster";
import { AnimatePresence, motion } from "motion/react";
import { useMapform } from "../context";
import { SearchLocationMarker } from "./search-location-marker";
import { Cluster } from "./cluster";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  pageData?: GetPageData["data"];
  editable?: boolean;
  mapPadding: ViewState["padding"];
  onLoad?: () => void;
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

            return (
              <SearchLocationMarker
                key={cluster.id}
                searchLocationMarker={{
                  latitude,
                  longitude,
                  icon: "city",
                }}
              >
                <Cluster
                  onClick={() => {
                    if (!expansionZoom || !map) {
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
              </SearchLocationMarker>
            );
          }

          return (
            <SearchLocationMarker
              key={cluster.properties.id}
              searchLocationMarker={{
                latitude,
                longitude,
                icon: "city",
              }}
            >
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-lg shadow-md"
                exit={{ opacity: 0, y: 20 }}
                initial={{ opacity: 0, y: -20 }}
                onClick={() => {
                  isMobile && window.scrollTo({ top: 0, behavior: "smooth" });
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
            </SearchLocationMarker>
          );
        })}
      </AnimatePresence>
      {children}
    </div>
  );
}

export { SearchLocationMarker };
