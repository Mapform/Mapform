"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";
import { DRAWER_WIDTH } from "~/constants/sidebars";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";

interface MapDrawerProps {
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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className="bg-background bg-opacity-98 group pointer-events-auto absolute top-0 z-10 mt-[calc(100dvh-200px)] flex min-h-dvh !w-full flex-col rounded-t-xl bg-white pb-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] outline-none backdrop-blur-sm transition-[filter,width,padding-left] duration-[250] [--y-from:200px] [--y-to:0]"
            layoutScroll
            animate="open"
            initial="closed"
            exit="closed"
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
            style={{
              zIndex: 30 - depth,
            }}
          >
            <div className="flex min-h-full flex-col">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const width = isFullWidth ? "calc(100% - 8px)" : DRAWER_WIDTH;

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
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-md:bg-opacity-98 sticky top-0 z-10 flex w-full rounded-t-xl p-2 max-md:bg-white max-md:backdrop-blur-sm",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2 mx-auto h-1.5 w-12 -translate-x-1/2 rounded-full bg-gray-200 md:hidden" />
      {children}
    </div>
  );
}
