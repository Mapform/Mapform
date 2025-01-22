"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";

export function DesktopDrawer({
  children,
  withPadding = false,
  open,
  className,
}: {
  open: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="popLayout">
      {open ? (
        <motion.div
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              default: {
                ease: "linear",
              },
              // default: {
              //   type: "spring",
              //   bounce: 0.2,
              //   duration: 1,
              // },
              opacity: { ease: "linear" },
            },
          }}
          className={cn(
            "bg-background prose group absolute bottom-0 top-0 z-40 flex h-full max-w-full flex-col shadow-lg outline-none",
            withPadding ? "w-[392px] pl-8" : "w-[360px]",
            className,
          )}
          exit={{ x: "-100%", opacity: 0 }}
          initial={{ x: "-100%", opacity: 0 }}
          layoutScroll
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div
      className={cn(
        "bg-background prose group absolute bottom-0 top-0 z-40 flex h-full max-w-full flex-col shadow-lg outline-none transition duration-500",
        withPadding ? "w-[392px] pl-8" : "w-[360px]",
        open
          ? "visible translate-x-0 opacity-100"
          : "-translate-x-full opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
