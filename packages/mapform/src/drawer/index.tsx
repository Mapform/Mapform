import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { DesktopDrawer } from "./desktop-drawer";
import { MobileDrawer } from "./mobile-drawer";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";

interface DrawerProps {
  open: boolean;
  // withPadding?: boolean;
  children: React.ReactNode;
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
          animate={{
            // y: 0,
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
            // DESKTOP (BASE) STYLES
            "bg-background prose group z-40 flex h-full w-[360px] flex-col shadow-lg outline-none",
            {
              "absolute bottom-0 left-0": positionDesktop === "absolute",
              "fixed bottom-0 left-0": positionDesktop === "fixed",
              relative: positionDesktop === "relative",
            },

            // MOBILE STYLES
            "max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-t-xl max-sm:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]",
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
          // exit={{ y: 200, opacity: 0 }}
          // initial={{ y: 200, opacity: 0 }}
          layoutScroll
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
