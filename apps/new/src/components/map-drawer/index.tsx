"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import { cn } from "@mapform/lib/classnames";
import { DRAWER_WIDTH } from "~/constants/sidebars";

interface MapDrawerProps {
  depth?: number;
  children: React.ReactNode;
  width?: number;
  animateIn?: boolean;
  animateOut?: boolean;
}

export function MapDrawer({
  depth = 0,
  children,
  width = DRAWER_WIDTH,
  animateIn = true,
  animateOut = true,
}: MapDrawerProps) {
  return (
    // <AnimatePresence>
    //   {open && (
    //     <motion.div
    //       className="absolute bottom-2 top-2 flex !select-text outline-none"
    //       initial={initialOpen ? false : { x: -width, width, opacity: 0 }}
    //       animate={{
    //         x: 16 * depth,
    //         width,
    //         scale: 1 - depth * 0.012,
    //         opacity: 1,
    //       }}
    //       exit={{ x: -width, width, opacity: 0 }}
    //       transition={{
    //         type: "spring",
    //         stiffness: 300,
    //         damping: 30,
    //       }}
    //       style={{
    //         zIndex: 30 - depth,
    //       }}
    //     >
    <ViewTransition
      enter={animateIn ? "slide-forward" : "none"}
      exit={animateOut ? "slide-back" : "none"}
    >
      <div
        className={cn(
          "absolute bottom-2 top-2 flex !select-text outline-none transition-transform",
        )}
        style={{
          width,
          zIndex: 30 - depth,
          scale: 1 - depth * 0.012,
          transform: `translateX(${16 * depth}px)`,
        }}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-50 rounded-lg bg-gray-950 transition-opacity duration-200",
          )}
          style={{
            opacity: depth ? 0.4 + depth * 0.15 : 0,
          }}
        />
        <div className="bg-opacity-96 flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white backdrop-blur-sm">
          {children}
        </div>
      </div>
    </ViewTransition>
    //     </motion.div>
    //   )}
    // </AnimatePresence>
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
