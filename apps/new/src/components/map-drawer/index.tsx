import { AnimatePresence, motion } from "motion/react";
import { DRAWER_WIDTH } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/[pId]/map-view/constants";

interface MapDrawerProps {
  // isPending: boolean;
  open: boolean;
  depth?: number;
  children: React.ReactNode;
}

export function MapDrawer({ open, depth = 0, children }: MapDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute bottom-2 top-2 z-20 flex !select-text outline-none"
          style={{
            width: DRAWER_WIDTH,
          }}
          initial={{ x: -DRAWER_WIDTH }}
          animate={{
            x: 8 + 16 * depth,
            scale: depth > 0 ? 0.985 : 1,
          }}
          exit={{ x: -DRAWER_WIDTH }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MapDrawerActionButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="-mx-6 -mt-6">{children}</div>;
}
