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
import { useWindowSize } from "@mapform/lib/hooks/use-window-size";
import { AnimatePresence, motion } from "motion/react";

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
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  mapContainerBounds: DOMRectReadOnly | undefined;
}

export const MapformContext = createContext<MapformContextProps>(
  {} as MapformContextProps,
);
export const useMapform = () => useContext(MapformContext);

export function Mapform({ children }: MapformProps) {
  const [map, setMap] = useState<MBMap>();
  const { ref: mapContainer, bounds } = useMeasure<HTMLDivElement>();

  const mapContainerBounds = bounds;

  return (
    <MapformContext.Provider
      value={{
        map,
        setMap,
        mapContainer,
        mapContainerBounds,
      }}
    >
      {children}
    </MapformContext.Provider>
  );
}

interface MapformContentProps {
  children: React.ReactNode;
  drawerValues: string[];
  onDrawerValuesChange: (values: string[]) => void;
  isEditing?: boolean;
}

interface MapformContentContextProps {
  drawerValues: string[];
  onDrawerValuesChange: (values: string[]) => void;
  isEditing?: boolean;
}

export const MapformContentContext = createContext<MapformContentContextProps>(
  {} as MapformContentContextProps,
);
export const useMapformContent = () => useContext(MapformContentContext);

export function MapformContent({
  children,
  isEditing,
  drawerValues,
  onDrawerValuesChange,
}: MapformContentProps) {
  return (
    <MapformContentContext.Provider
      value={{ isEditing, drawerValues, onDrawerValuesChange }}
    >
      <div className="relative flex-1 md:flex md:overflow-hidden">
        {children}
        {/* <Button
          className={cn(
            "absolute left-2 top-2 z-10 shadow-sm transition-opacity delay-300 duration-300 max-md:hidden",
            {
              // "opacity-0": drawerOpen,
            },
          )}
          onClick={() => {
            // setDrawerOpen(true);
          }}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <ChevronsRightIcon className="size-5" />
        </Button> */}
      </div>
    </MapformContentContext.Provider>
  );
}

export function MapformMap({
  children,
  initialViewState,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
}) {
  const { width } = useWindowSize();
  const { drawerValues, isEditing } = useMapformContent();
  const isMobile = !!width && width < 768;

  const mapPadding = {
    top: 0,
    bottom: isMobile ? 200 : 0,
    left: !!drawerValues.length && !isMobile ? (isEditing ? 392 : 360) : 0,
    right: 0,
  };

  return (
    <div className="top-0 flex flex-1 max-md:sticky max-md:mb-[-200px] max-md:h-dvh">
      <Map
        isEditing={isEditing}
        initialViewState={initialViewState}
        isMobile={isMobile}
        mapPadding={mapPadding}
        // onLoad={onLoad}
        // pageData={pageData}
      >
        {children}
      </Map>
    </div>
  );
}

export function MapformDrawers({ children }: { children: React.ReactNode }) {
  return <AnimatePresence mode="popLayout">{children}</AnimatePresence>;
}

export function MapformDrawer({
  children,
  className,
  value,
  positionDesktop = "relative",
  positionMobile = "relative",
}: {
  children: React.ReactNode;
  value: string;
  // This is a workaround to render the bottom bar since position fixed doesn't work
  positionDesktop?: "relative" | "fixed" | "absolute";
  positionMobile?: "relative" | "fixed" | "absolute";
  className?: string;
}) {
  const { drawerValues, isEditing, onDrawerValuesChange } = useMapformContent();

  if (!drawerValues.includes(value)) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        // BASE STYLES
        "bg-background prose group z-40 flex flex-col shadow-lg outline-none",

        // DESKTOP STYLES
        "sm:h-full sm:w-[360px] sm:[--x-from:-100%] sm:[--x-to:0]",
        {
          "sm:absolute sm:bottom-0 sm:left-0": positionDesktop === "absolute",
          "sm:fixed sm:bottom-0 sm:left-0": positionDesktop === "fixed",
          "sm:relative": positionDesktop === "relative",
        },

        // MOBILE STYLES
        "max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-t-xl max-sm:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] max-sm:[--y-from:200px] max-sm:[--y-to:0]",
        {
          "max-sm:absolute max-sm:bottom-0 max-sm:left-0":
            positionMobile === "absolute",
          "max-sm:fixed max-sm:bottom-0 max-sm:left-0":
            positionMobile === "fixed",
          "max-sm:relative": positionMobile === "relative",
        },

        // EDITING STYLES
        {
          "pl-8 sm:w-[392px]": isEditing,
          "overflow-hidden": !isEditing,
        },

        className,
      )}
      layoutScroll
      animate="open"
      initial="closed"
      exit="closed"
      transition={{
        duration: 0.2,
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
      <Button
        className="absolute right-2 top-2 z-50"
        onClick={() =>
          onDrawerValuesChange(drawerValues.filter((v) => v !== value))
        }
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <XIcon className="size-5" />
      </Button>
      {children}
    </motion.div>
  );
}

export function MapformDrawerButton({ onOpen }: { onOpen: () => void }) {
  const { drawerValues, onDrawerValuesChange } = useMapformContent();

  return (
    <Button
      className={cn(
        "absolute left-2 top-2 z-10 shadow-sm transition-opacity delay-300 duration-300 max-md:hidden",
        {
          "opacity-0": drawerValues.length,
        },
      )}
      onClick={() => {
        if (drawerValues.length) {
          onDrawerValuesChange([]);
        } else {
          onOpen();
        }
      }}
      size="icon-sm"
      type="button"
      variant="outline"
    >
      <ChevronsRightIcon className="size-5" />
    </Button>
  );
}
