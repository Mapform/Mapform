"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";
import { DRAWER_WIDTH } from "~/constants/sidebars";

interface MapDrawerProps {
  open: boolean;
  depth?: number;
  children: React.ReactNode;
  width?: number;
  /**
   * This is used to unmount the drawer content when the drawer is closed. This
   * helps improve performance. Note that Page drawers (eg. Settings) should not
   * be unmountOnClose because they may have other content (like Points) that
   * need to remain open as longas that page is active.
   */
  unmountOnClose?: boolean;
}

export function MapDrawer({
  open,
  depth = 0,
  children,
  width = DRAWER_WIDTH,
  unmountOnClose = false,
}: MapDrawerProps) {
  if (unmountOnClose) {
    return (
      <AnimatePresence>
        {open && (
          <DrawerMotion
            open={open}
            depth={depth}
            width={width}
            initial="closed"
            exit="closed"
          >
            {children}
          </DrawerMotion>
        )}
      </AnimatePresence>
    );
  }

  return (
    <DrawerMotion open={open} depth={depth} width={width} initial={false}>
      {children}
    </DrawerMotion>
  );
}

type DrawerContext = { depth: number; width: number };

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

const drawerVariants = {
  open: ({ depth, width }: DrawerContext) => ({
    x: 16 * depth,
    width,
    scale: 1 - depth * 0.012,
    opacity: 1,
  }),
  closed: ({ width, depth }: DrawerContext) => ({
    x: -width,
    width,
    scale: 1 - depth * 0.012,
    opacity: 0,
  }),
} as const;

function DrawerMotion({
  open,
  depth = 0,
  width = DRAWER_WIDTH,
  children,
  initial,
  exit,
}: {
  open: boolean;
  depth?: number;
  width?: number;
  children: React.ReactNode;
  initial: false | "open" | "closed";
  exit?: "open" | "closed";
}) {
  return (
    <motion.div
      className="absolute bottom-2 top-2 flex !select-text outline-none"
      custom={{ depth, width }}
      initial={initial}
      animate={open ? "open" : "closed"}
      exit={exit}
      variants={drawerVariants}
      transition={springTransition}
      style={{ zIndex: 30 - depth, pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
      data-state={open ? "open" : "closed"}
    >
      {/* Copy content with mask when when other drawers open on top */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-50 rounded-lg bg-gray-950 transition-opacity duration-200",
        )}
        style={{ opacity: open ? (depth ? 0.4 + depth * 0.15 : 0) : 0 }}
      />
      <div className="bg-opacity-98 flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
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
