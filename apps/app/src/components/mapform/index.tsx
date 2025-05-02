"use client";

import {
  useState,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ViewState } from "@mapform/map-utils/types";
import type mapboxgl from "mapbox-gl";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon, XIcon } from "lucide-react";

import { Map } from "./map";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";
import { AnimatePresence, motion } from "motion/react";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { MapboxGeoJSONFeature } from "mapbox-gl";
import { GetLayerFeature } from "@mapform/backend/data/datalayer/get-layer-feature";

export type MBMap = mapboxgl.Map;
export interface ActivePoint {
  id: string;
  color: string;
  title: string;
  description?: string;
}

interface MapformProps {
  children: React.ReactNode;
}

interface MapformContextProps {
  map?: MBMap;
  draw?: MapboxDraw;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
  setDraw: Dispatch<SetStateAction<MapboxDraw | undefined>>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  mapContainerBounds: DOMRectReadOnly | undefined;
  activeFeature: MapboxGeoJSONFeature | null;
  setActiveFeature: Dispatch<SetStateAction<MapboxGeoJSONFeature | null>>;
}

export const MapformContext = createContext<MapformContextProps>(
  {} as MapformContextProps,
);
export const useMapform = () => useContext(MapformContext);

export function Mapform({ children }: MapformProps) {
  const [map, setMap] = useState<MBMap>();
  const [activeFeature, setActiveFeature] =
    useState<MapboxGeoJSONFeature | null>(null);
  const [draw, setDraw] = useState<MapboxDraw>();
  const { ref: mapContainer, bounds } = useMeasure<HTMLDivElement>();

  const mapContainerBounds = bounds;

  return (
    <MapformContext.Provider
      value={{
        map,
        draw,
        setMap,
        setDraw,
        mapContainer,
        mapContainerBounds,
        activeFeature,
        setActiveFeature,
      }}
    >
      {children}
    </MapformContext.Provider>
  );
}

interface MapformContentProps {
  children: React.ReactNode;
  drawerValues: string[];
  isEditing?: boolean;
  pageData?: GetPageData["data"];
}

interface MapformContentContextProps {
  drawerValues: string[];
  isEditing?: boolean;
  pageData?: GetPageData["data"];
}

export const MapformContentContext = createContext<MapformContentContextProps>(
  {} as MapformContentContextProps,
);
export const useMapformContent = () => useContext(MapformContentContext);

export function MapformContent({
  children,
  pageData,
  isEditing,
  drawerValues,
}: MapformContentProps) {
  return (
    <MapformContentContext.Provider
      value={{ isEditing, drawerValues, pageData }}
    >
      <div className="relative flex-1 md:flex md:overflow-hidden">
        {children}
      </div>
    </MapformContentContext.Provider>
  );
}

export function MapformMap({
  children,
  initialViewState,
  isStatic = true,
  selectedFeature,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
  isStatic?: boolean;
  selectedFeature?: GetLayerFeature["data"];
}) {
  const isMobile = useIsMobile();
  const { drawerValues, isEditing, pageData } = useMapformContent();

  const mapPadding = {
    top: 0,
    bottom: isMobile ? (drawerValues.length ? 200 : 0) : 0,
    left: !!drawerValues.length && !isMobile ? (isEditing ? 392 : 360) : 0,
    right: 0,
  };

  return (
    <div className="top-0 flex flex-1 max-md:sticky max-md:mb-[-200px] max-md:h-dvh">
      <Map
        isStatic={isStatic}
        isEditing={isEditing}
        initialViewState={initialViewState}
        isMobile={isMobile}
        mapPadding={mapPadding}
        pageData={pageData}
        selectedFeature={selectedFeature}
      >
        {children}
      </Map>
    </div>
  );
}

export function MapformDrawer({
  children,
  className,
  value,
  onClose,
  mobileBottomPadding,
  hideDragBar = false,
}: {
  children: React.ReactNode;
  value: string;
  // This is a workaround to render the bottom bar since position fixed doesn't work
  className?: string;
  onClose?: () => void;
  mobileBottomPadding?: boolean;
  hideDragBar?: boolean;
}) {
  const isMobile = useIsMobile();
  const { drawerValues, isEditing } = useMapformContent();
  const valueIndex = drawerValues.indexOf(value);
  const reveresedValues = drawerValues.concat().reverse();
  const reverseValueIndex = reveresedValues.indexOf(value);

  return (
    <AnimatePresence mode="popLayout">
      {/* This can be used if we want to keep all drawer open. Helpful if going with stacked ui. */}
      {/* drawerValues.includes(value) */}
      {drawerValues[drawerValues.length - 1] === value ? (
        <motion.div
          className={cn(
            // BASE STYLES
            "bg-background group z-40 flex min-h-[200px] flex-col shadow-lg outline-none transition-[filter,width,padding-left] duration-[250]",
            {
              "pb-20": isMobile && mobileBottomPadding,
            },

            // DESKTOP STYLES
            "md:absolute md:bottom-0 md:left-0 md:h-full md:w-[360px] md:[--x-from:-100%] md:[--x-to:0]",

            // MOBILE STYLES
            "max-md:relative max-md:w-full max-md:overflow-y-auto max-md:rounded-t-xl max-md:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] max-md:[--y-from:200px] max-md:[--y-to:0]",

            // EDITING STYLES
            {
              "overflow-hidden": !isEditing,
            },
            className,
          )}
          layoutScroll
          animate="open"
          initial="closed"
          exit="closed"
          style={{
            zIndex: 40 + valueIndex,
            marginBottom: isMobile ? 1 * reverseValueIndex * 10 : 0,
            filter: `brightness(${1 - reverseValueIndex * 0.1})`,
            display: isMobile && reverseValueIndex !== 0 ? "none" : "flex",
            // Used for stacked ui
            // ...(!isMobile && {
            //   width: (isEditing ? 392 : 360) + reverseValueIndex * 10,
            //   paddingLeft: (isEditing ? 32 : 0) + reverseValueIndex * 10,
            // }),
            ...(!isMobile && {
              width: isEditing ? 392 : 360,
              paddingLeft: isEditing ? 32 : 0,
            }),
          }}
          transition={{
            duration: 0.25,
          }}
          variants={{
            open: {
              opacity: 1,
              y: "var(--y-to, 0)",
              x: "var(--x-to, 0)",
            },
            closed: {
              opacity: 0,
              y: "var(--y-from, 0)",
              x: "var(--x-from, 0)",
            },
          }}
        >
          {!hideDragBar && (
            <div className="absolute left-1/2 top-1 -translate-x-1/2 md:hidden">
              <div className="h-1.5 w-12 rounded-full bg-gray-300" />
            </div>
          )}
          {onClose ? (
            <Button
              className="absolute right-2 top-2 z-50"
              onClick={onClose}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <XIcon className="size-5" />
            </Button>
          ) : null}
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function MapformDrawerButton({
  onDrawerStackOpenChange,
}: {
  onDrawerStackOpenChange: (isOpen: boolean) => void;
}) {
  const { drawerValues } = useMapformContent();

  return (
    <Button
      className={cn(
        "fixed bottom-20 left-1/2 z-10 -translate-x-1/2 -rotate-90 shadow-sm transition-opacity delay-300 duration-300 md:absolute md:left-2 md:top-2 md:translate-x-0 md:rotate-0",
        {
          "opacity-0": drawerValues.length,
        },
      )}
      onClick={() => {
        onDrawerStackOpenChange(!drawerValues.length);
      }}
      size="icon-sm"
      type="button"
      variant="outline"
    >
      <ChevronsRightIcon className="size-5" />
    </Button>
  );
}

export type { MapboxEvent } from "mapbox-gl";
