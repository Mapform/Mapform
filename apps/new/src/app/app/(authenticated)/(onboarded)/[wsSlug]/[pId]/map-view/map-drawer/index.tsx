import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { cn } from "@mapform/lib/classnames";
import { Header } from "../../header";
import { DRAWER_WIDTH } from "../constants";
import { FeatureDrawer } from "./feature-drawer";
import { useProject } from "../../context";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { useMap } from "~/components/map";
import { useParamsContext } from "~/lib/params/client";
import { AnimatePresence, motion } from "motion/react";

interface MapDrawerProps {
  drawerOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setDrawerOpen: (open: boolean) => void;
}

export function MapDrawer({
  drawerOpen,
  containerRef,
  setDrawerOpen,
}: MapDrawerProps) {
  const { map } = useMap();
  const { projectService } = useProject();
  const {
    params: { rowId },
    setQueryStates,
  } = useParamsContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="!pointer-events-auto absolute bottom-2 left-2 top-2 z-10 flex !select-text outline-none"
              style={{
                width: DRAWER_WIDTH,
              }}
              initial={{ x: -DRAWER_WIDTH - 16 }}
              animate={{
                x: 0,
                scale: rowId ? 0.985 : 1,
              }}
              exit={{ x: -DRAWER_WIDTH - 16 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div
                className={cn(
                  "flex h-full w-full grow flex-col gap-4 overflow-hidden rounded-lg bg-white p-6 transition-transform",
                )}
              >
                {/* Overlay when feature is displayed over the drawer */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 z-50 bg-gray-950 transition-opacity duration-200",
                    {
                      "opacity-50": !!rowId,
                      "opacity-0": !rowId,
                    },
                  )}
                />

                <Button
                  className="absolute right-2.5 top-2.5 z-10"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDrawerOpen(false);
                  }}
                >
                  <XIcon className="size-4" />
                </Button>
                <Header />
                <ul className="flex flex-col gap-2">
                  {projectService.optimisticState.rows.map((row) => (
                    <li
                      key={row.id}
                      className="cursor-pointer rounded-lg border p-2 transition-colors hover:border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        void setQueryStates({ rowId: row.id });

                        map?.flyTo({
                          center: row.center.coordinates as [number, number],
                          duration: 500,
                        });
                      }}
                    >
                      {row.name}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FeatureDrawer containerRef={containerRef} />
      </>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
