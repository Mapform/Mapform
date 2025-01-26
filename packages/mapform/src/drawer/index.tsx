import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";

interface DrawerProps {
  open: boolean;
  children: React.ReactNode;
  // This is a workaround to render the bottom bar since position fixed doesn't work
  positionDesktop?: "relative" | "fixed" | "absolute";
  positionMobile?: "relative" | "fixed" | "absolute";
  isEditing?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Drawer({
  open,
  children,
  className,
  onClose,
  positionDesktop = "relative",
  positionMobile = "relative",
  isEditing = false,
}: DrawerProps) {
  return (
    <AnimatePresence mode="popLayout">
      {open ? (
        <motion.div
          className={cn(
            // BASE STYLES
            "bg-background prose group z-40 flex flex-col shadow-lg outline-none",

            // DESKTOP STYLES
            "sm:h-full sm:w-[360px] sm:[--x-from:-100%] sm:[--x-to:0]",
            {
              "sm:absolute sm:bottom-0 sm:left-0":
                positionDesktop === "absolute",
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
