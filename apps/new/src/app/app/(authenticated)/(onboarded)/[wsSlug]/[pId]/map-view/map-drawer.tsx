import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { Header } from "../header";
import { DRAWER_WIDTH } from "./contants";
import { cn } from "@mapform/lib/classnames";
import { useProject } from "../context";

interface MapDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export function MapDrawer({ drawerOpen, setDrawerOpen }: MapDrawerProps) {
  const { project } = useProject();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DrawerPrimitive.Root
        direction="left"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        modal={false}
      >
        <DrawerPrimitive.Content
          className={cn(
            "absolute bottom-2 left-2 top-2 z-10 flex outline-none",
            `w-[${DRAWER_WIDTH}px]`,
          )}
          style={
            {
              "--initial-transform": "calc(100% + 8px)",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col rounded-lg bg-white p-6">
            <Header />
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Root>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
