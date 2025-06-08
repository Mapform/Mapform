import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { useEffect, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { ViewState } from "@mapform/map-utils/types";
import type { GetFeatures } from "@mapform/backend/data/features/get-features";
import { usePrevious } from "@mapform/lib/hooks/use-previous";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useDrawFeatures } from "~/lib/map-tools/draw-features";
import type { GetFeature } from "@mapform/backend/data/features/get-feature";
import {
  type BaseFeature,
  isPersistedFeature,
} from "@mapform/backend/data/features/types";
import { LocationMarker } from "../../location-marker";
import { mapStyles } from "./map-styles";
import { useMapform, useMapformContent } from "../index";
import "./style.css";
import type { upsertCellAction } from "~/data/cells/upsert-cell";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";
import { loadPointImage } from "~/lib/map-tools/point-image-utils";
import type { MapMouseEvent, MapTouchEvent } from "mapbox-gl";
import type { FeatureCollection } from "geojson";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export interface MapProps {
  isEditing?: boolean;
  initialViewState: ViewState;
  children?: React.ReactNode;
  isStatic?: boolean;
  selectedFeature?: GetFeature["data"];
  setSelectedFeature: (feature: BaseFeature | undefined) => void;
  features: NonNullable<GetFeatures["data"]> | undefined;
  updateFeatures?: (args: Parameters<typeof upsertCellAction>[0]) => void;
}

export function Map({
  initialViewState,
  children,
  isStatic = true,
  selectedFeature,
  setSelectedFeature,
  updateFeatures,
  features,
}: MapProps) {
  const {
    draw,
    map,
    setMap,
    setDraw,
    mapContainer,
    mapContainerBounds,
    visibleMapContainer,
    drawFeature: drawFeature,
    setDrawFeature,
  } = useMapform();
  const isMobile = useIsMobile();
  const { drawerValues, isEditing } = useMapformContent();

  const mapPadding = useMemo(() => {
    return {
      top: 0,
      bottom: isMobile ? (drawerValues.length ? 200 : 0) : 0,
      left: !!drawerValues.length && !isMobile ? (isEditing ? 392 : 360) : 0,
      right: 0,
    };
  }, [drawerValues, isEditing, isMobile]);

  // Condition in usePrevious resolves issue where map padding is not updated on first render
  const prevMapPadding = usePrevious(map ? mapPadding : undefined);

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
        /**
         * Define custom mode which uses Draw to render features, but disables
         * editing. This is used to keep rendering features consistent across
         * modes.
         */
        const StaticMode = {
          onClick: function (state: unknown, e: MapMouseEvent) {
            const event = e as MapMouseEvent & {
              featureTarget?: { properties: { id: string } };
            };

            if (!event.featureTarget) {
              setSelectedFeature(undefined);
              return;
            }

            const featureId = event.featureTarget.properties.id;
            const originalFeature = draw.get(featureId);

            if (!originalFeature) return;

            setSelectedFeature({
              ...originalFeature,
              properties: {
                ...originalFeature.properties,
                id: originalFeature.id,
              },
            } as BaseFeature);
          },

          onTap: function (state: unknown, e: MapTouchEvent) {
            const event = e as MapTouchEvent & {
              featureTarget?: { properties: { id: string } };
            };

            if (!event.featureTarget) {
              setSelectedFeature(undefined);
              return;
            }

            const featureId = event.featureTarget.properties.id;
            const originalFeature = draw.get(featureId);

            if (!originalFeature) return;

            setSelectedFeature({
              ...originalFeature,
              properties: {
                ...originalFeature.properties,
                id: originalFeature.id,
              },
            } as BaseFeature);
          },

          toDisplayFeatures: function (
            state: unknown,
            geojson: GeoJSON.Feature,
            display: (feature: GeoJSON.Feature) => void,
          ) {
            display(geojson);
          },
        };

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          modes: {
            ...MapboxDraw.modes,
            static: StaticMode,
          },
          defaultMode: isStatic ? "static" : "simple_select",
          styles: mapStyles,
          userProperties: true,
          boxSelect: false,
        });

        m.addControl(draw);
        setDraw(draw);
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
    try {
      if (map) {
        map.resize();
      }
    } catch (error) {
      console.error(error);
    }
  }, [map, mapContainerBounds]);

  useEffect(() => {
    if (!map || !draw) return;

    const handleDrawCreate = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      const feature = e.features[0];

      if (!feature) return;

      setDrawFeature(feature);
    };

    const handleDrawUpdate = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      const feature = e.features[0];

      if (!feature) return;

      if (!feature.id) {
        setDrawFeature(feature);
        return;
      }

      if (!isPersistedFeature(feature)) {
        return;
      }

      if (!updateFeatures) {
        return;
      }

      if (feature.geometry.type === "Polygon") {
        updateFeatures({
          type: "polygon",
          value: { coordinates: feature.geometry.coordinates },
          rowId: feature.properties.rowId,
          columnId: feature.properties.columnId,
        });
      }

      if (feature.geometry.type === "LineString") {
        updateFeatures({
          type: "line",
          value: { coordinates: feature.geometry.coordinates },
          rowId: feature.properties.rowId,
          columnId: feature.properties.columnId,
        });
      }

      if (feature.geometry.type === "Point") {
        updateFeatures({
          type: "point",
          value: {
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1],
          },
          rowId: feature.properties.rowId,
          columnId: feature.properties.columnId,
        });
      }
    };

    const handleDrawSelectionChange = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      const eventFeature = e.features[e.features.length - 1];

      if (eventFeature && isPersistedFeature(eventFeature)) {
        setSelectedFeature(eventFeature);
      } else if (e.features.length === 0) {
        setSelectedFeature(undefined);
      }

      if (drawFeature !== null && eventFeature?.id !== drawFeature.id) {
        setDrawFeature(null);
        try {
          draw.delete(drawFeature.id as string);
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
    };

    const handleDrawDelete = (
      e: mapboxgl.MapMouseEvent & { features: mapboxgl.MapboxGeoJSONFeature[] },
    ) => {
      // TODO: Handle delete.
    };

    /**
     * This is needed for cursor hover on features when in static mode.
     */
    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (!isStatic) return;

      const features = map.queryRenderedFeatures(e.point);
      map.getCanvas().style.cursor = features.length ? "pointer" : "";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStatic) {
        return;
      }

      // We manually handle calling delete due to issue in MapboxDraw: https://github.com/mapbox/mapbox-gl-draw/issues/989
      if (e.key === "Delete" || e.key === "Backspace") {
        // TODO: Remove. Temporarily prevent deleting features in simple_select until handleDrawDelete is implemented
        if (draw.getMode() === "simple_select") return;

        // trash will handle either deleting the feature or the vertex depending on the mode
        draw.trash();
      }
    };

    const currentContainer = mapContainer.current;

    map.on("draw.create", handleDrawCreate);
    map.on("draw.update", handleDrawUpdate);
    map.on("draw.selectionchange", handleDrawSelectionChange);
    map.on("draw.delete", handleDrawDelete);
    map.on("mousemove", handleMouseMove);
    currentContainer?.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("draw.create", handleDrawCreate);
      map.off("draw.update", handleDrawUpdate);
      map.off("draw.selectionchange", handleDrawSelectionChange);
      map.off("draw.delete", handleDrawDelete);
      map.off("mousemove", handleMouseMove);
      currentContainer?.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    map,
    draw,
    isStatic,
    mapContainer,
    drawFeature,
    setDrawFeature,
    updateFeatures,
    setSelectedFeature,
  ]);

  // Used to select the feature on the map
  useEffect(() => {
    if (selectedFeature && !isStatic) {
      const selected = draw?.get(selectedFeature.id);
      if (!selected) {
        draw?.changeMode("simple_select", {
          featureIds: [selectedFeature.id],
        });
      }
    }
  }, [selectedFeature, draw, isStatic]);

  useDrawFeatures({
    features: {
      type: "FeatureCollection",
      features:
        features?.features.map((feature) => ({
          type: feature.type,
          geometry: feature.geometry,
          id: feature.id,
          properties: {
            flat_icon: `image-${feature.properties.icon?.value ?? "none"}-${feature.properties.color ?? "none"}`,
            ...feature.properties,
            ...(isStatic
              ? { active: (selectedFeature?.id === feature.id).toString() }
              : {}),
          },
        })) ?? [],
    } as FeatureCollection,
  });

  // Add this effect to load emoji images and add the emoji layer
  useEffect(() => {
    if (!map || !features) return;

    const loadPointImages = async () => {
      const uniqueIconColorPairs = new Set<string>();
      features.features
        .filter(
          (f): f is NonNullable<typeof f> => f.properties.layerType === "point",
        )
        .forEach((f) => {
          const icon = f.properties.icon?.value;
          const color = f.properties.color;
          uniqueIconColorPairs.add(`${icon ?? ""}|||${color ?? ""}`);
        });

      for (const pair of uniqueIconColorPairs) {
        const [icon, color] = pair.split("|||");
        const imageId = `image-${icon || "none"}-${color || "none"}`;
        if (!map.hasImage(imageId)) {
          try {
            await loadPointImage(
              map,
              icon,
              imageId,
              color === "none" ? null : color,
            );
          } catch (error) {
            console.error(
              `Failed to load point image for icon ${icon} and color ${color}:`,
              error,
            );
          }
        }
      }
    };

    void loadPointImages();
  }, [map, features]);

  return (
    <div className="top-0 flex flex-1 max-md:sticky max-md:mb-[-200px] max-md:h-dvh">
      <div
        className={cn("relative flex-1 overflow-hidden", {
          "rounded-md": isEditing,
        })}
        ref={mapContainer}
      >
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 overflow-hidden transition-all duration-[250]",
          )}
          ref={visibleMapContainer}
          style={mapPadding}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export { LocationMarker };
