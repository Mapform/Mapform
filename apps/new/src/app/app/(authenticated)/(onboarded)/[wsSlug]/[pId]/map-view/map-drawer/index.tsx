import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { cn } from "@mapform/lib/classnames";
import { useQueryStates } from "nuqs";
import { Header } from "../../header";
import { DRAWER_WIDTH } from "../constants";
import { projectSearchParams, projectSearchParamsUrlKeys } from "../../params";
import { FeatureDrawer } from "./feature-drawer";
import { useProject } from "../../context";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";

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
  const { project } = useProject();
  const [{ rowId }] = useQueryStates(projectSearchParams, {
    urlKeys: projectSearchParamsUrlKeys,
    shallow: false,
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DrawerPrimitive.Root
        direction="left"
        defaultOpen
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        modal={false}
        container={containerRef.current}
        dismissible={false}
      >
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Content
            className="!pointer-events-auto absolute bottom-2 left-2 top-2 z-10 flex !select-text outline-none"
            style={
              {
                width: DRAWER_WIDTH,
              } as React.CSSProperties
            }
          >
            <div
              className={cn(
                "flex h-full w-full grow flex-col gap-4 rounded-lg bg-white p-6 transition-transform",
                { "scale-[99%] border-gray-300 bg-gray-300": !!rowId },
              )}
            >
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
              <ul>
                {project.rows.map((row) => (
                  <li key={row.id}>{row.name}</li>
                ))}
              </ul>
            </div>
            <FeatureDrawer containerRef={containerRef} />
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
