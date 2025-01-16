"use client";

import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function MobileDrawer({
  open,
  children,
  withPadding = false,
  className,
  onClose,
}: {
  open: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <AnimatePresence mode="popLayout">
      {open ? (
        <motion.div
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              default: {
                type: "spring",
                bounce: 0.2,
                duration: 1,
              },
              opacity: { ease: "linear" },
            },
          }}
          className={cn(
            "bg-background prose relative z-40 flex h-full min-h-[200px] w-full max-w-full flex-col overflow-hidden rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] outline-none",
            withPadding ? "pl-8" : "pl-0",
            className,
          )}
          exit={{ y: 200, opacity: 0 }}
          initial={{ y: 200, opacity: 0 }}
          layoutScroll
          style={{
            overflow: "scroll",
          }}
        >
          {onClose ? (
            <Button
              className="absolute right-2 top-2"
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
