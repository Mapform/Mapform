import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { Header } from "../header";
import { DRAWER_WIDTH } from "./contants";
import { useProject } from "../context";
import { useQueryStates } from "nuqs";
import { projectSearchParams, projectSearchParamsUrlKeys } from "../params";
import { XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { cn } from "@mapform/lib/classnames";

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
  const { feature } = useProject();
  const [{ rowId }, setProjectSearchParams] = useQueryStates(
    projectSearchParams,
    {
      urlKeys: projectSearchParamsUrlKeys,
      shallow: false,
    },
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DrawerPrimitive.Root
        direction="left"
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
                "flex h-full w-full grow flex-col rounded-lg border bg-white p-6 transition-transform",
                { "scale-[99%] border-gray-300 bg-gray-300": !!rowId },
              )}
            >
              <Header />
            </div>
            <DrawerPrimitive.NestedRoot
              container={containerRef.current}
              open={!!rowId}
              direction="left"
              modal={false}
              dismissible={false}
              onOpenChange={(open) => {
                if (!open) {
                  void setProjectSearchParams({ rowId: undefined });
                }
              }}
            >
              <DrawerPrimitive.Portal>
                <DrawerPrimitive.Content
                  // point-events-auto needed to work around Vaul bug: https://github.com/emilkowalski/vaul/pull/576
                  className="!pointer-events-auto absolute bottom-2 left-2 top-2 z-20 flex !select-text outline-none"
                  style={
                    {
                      width: DRAWER_WIDTH - 16,
                    } as React.CSSProperties
                  }
                >
                  <div className="flex h-full w-full grow flex-col rounded-lg border bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Feature Details
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          void setProjectSearchParams({ rowId: null });
                        }}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600">
                        This is the nested drawer content. You can close this
                        independently of the root drawer.
                      </p>
                    </div>
                  </div>
                </DrawerPrimitive.Content>
              </DrawerPrimitive.Portal>
            </DrawerPrimitive.NestedRoot>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
