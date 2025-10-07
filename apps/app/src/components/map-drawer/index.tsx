"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";
import { DRAWER_WIDTH } from "~/constants/sidebars";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";
import { useEffect } from "react";

interface MapDrawerProps {
  open: boolean;
  initialOpen?: boolean;
  depth?: number;
  children: React.ReactNode;
  isFullWidth?: boolean;
  mobileInitialScrollPosition?: "top" | "bottom";
  className?: string;
}

export function MapDrawer({
  open,
  initialOpen = false,
  depth = 0,
  children,
  isFullWidth = false,
  mobileInitialScrollPosition = "top",
  className,
}: MapDrawerProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open || depth !== 0) return;

    if (isMobile) {
      const container = document.querySelector<HTMLElement>(
        "[data-map-scroll-container]",
      );
      if (!container) return;

      if (mobileInitialScrollPosition === "bottom") {
        container.scrollTo({ top: 0, behavior: "auto" });
      } else if (mobileInitialScrollPosition === "top") {
        setTimeout(() => {
          container.scrollTo({
            top: window.innerHeight - 200,
            behavior: "auto",
          });
        }, 0);
      }
    }
  }, [isMobile, mobileInitialScrollPosition, open, depth]);

  if (isMobile) {
    return (
      <>
        {open && depth === 0 && (
          <div
            className="z-10 h-dvh w-dvw overflow-y-auto"
            data-map-scroll-container
          >
            <motion.div
              className={cn(
                "bg-background group relative z-20 mt-[calc(100dvh-200px)] flex h-fit min-h-dvh !w-dvw flex-col bg-white pb-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] outline-none transition-[filter,width,padding-left] duration-[250] [--y-from:200px] [--y-to:0]",
                className,
              )}
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
                },
                closed: {
                  opacity: 0,
                  y: "var(--y-from, 0)",
                },
              }}
              style={{
                zIndex: 30 - depth,
              }}
            >
              <div className="flex min-h-full flex-1 flex-col">{children}</div>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  const width = isFullWidth ? "calc(100% - 8px)" : DRAWER_WIDTH;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "absolute bottom-2 top-2 flex !select-text outline-none",
            className,
          )}
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
          <div className="flex size-full min-h-full grow flex-col overflow-hidden overflow-y-auto rounded-lg border bg-white">
            {children}
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
      className={cn("sticky top-0 z-20 flex w-full bg-white p-3", className)}
    >
      <div className="bg-muted absolute left-1/2 top-[3px] mx-auto h-1.5 w-12 -translate-x-1/2 rounded-full md:hidden" />
      {children}
    </div>
  );
}
