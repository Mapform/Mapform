"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";
import { DRAWER_WIDTH } from "~/constants/sidebars";
import { useMapPadding } from "~/lib/map/use-map-padding";

interface MapDrawerProps {
  // isPending: boolean;
  open: boolean;
  initialOpen?: boolean;
  depth?: number;
  children: React.ReactNode;
  isFullWidth?: boolean;
}

export function MapDrawer({
  open,
  initialOpen = false,
  depth = 0,
  children,
  isFullWidth = false,
}: MapDrawerProps) {
  const map = useMap();
  const padding = useMapPadding();
  const width = isFullWidth ? "calc(100% - 8px)" : DRAWER_WIDTH;

  useEffect(() => {
    map.current?.easeTo({
      padding: padding,
    });
  }, [padding]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto absolute bottom-2 top-2 flex !select-text outline-none"
          initial={initialOpen ? false : { x: -width, width, opacity: 0 }}
          animate={{
            x: 16 * depth,
            width,
            scale: 1 - depth * 0.012,
            opacity: 1,
          }}
          exit={{ x: -width, width, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{
            zIndex: 30 - depth,
          }}
        >
          {/* Copy content with mask when when other drawers open on top */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-50 rounded-lg bg-gray-950 transition-opacity duration-200",
            )}
            style={{
              opacity: depth ? 0.4 + depth * 0.15 : 0,
            }}
          />
          <div className="bg-opacity-98 flex size-full grow flex-col rounded-lg border bg-white backdrop-blur-sm">
            <div className="flex min-h-full flex-col overflow-y-auto">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MapDrawerToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sticky top-0 z-10 flex w-full p-2", className)}>
      {children}
    </div>
  );
}
