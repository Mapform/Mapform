"use client";

import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface MapDrawerProps {
  // isPending: boolean;
  open: boolean;
  initialOpen?: boolean;
  depth?: number;
  onClose?: () => void;
  children: React.ReactNode;
}

const DRAWER_WIDTH = 360;

export function MapDrawer({
  open,
  initialOpen = false,
  depth = 0,
  onClose,
  children,
}: MapDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute bottom-2 top-2 z-20 flex !select-text outline-none"
          style={{
            width: DRAWER_WIDTH,
          }}
          initial={initialOpen ? false : { x: -DRAWER_WIDTH, opacity: 0 }}
          animate={{
            x: 16 * depth,
            scale: depth > 0 ? 0.985 : 1,
            opacity: 1,
          }}
          exit={{ x: -DRAWER_WIDTH, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {/* Copy content with mask when when other drawers open on top */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-50 rounded-lg bg-gray-950 transition-opacity duration-200",
              {
                "opacity-50": depth > 0,
                "opacity-0": depth === 0,
              },
            )}
          />
          <div className="flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white/95 p-4 backdrop-blur-sm">
            {onClose ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-2 top-2"
              >
                <XIcon className="size-4" />
              </Button>
            ) : null}
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
