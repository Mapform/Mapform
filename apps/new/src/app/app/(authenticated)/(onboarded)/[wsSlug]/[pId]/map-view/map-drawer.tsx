import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { useState } from "react";
import { Header } from "../header";

export function MapDrawer() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(true);

  if (isDesktop) {
    return (
      <DrawerPrimitive.Root
        direction="left"
        open={open}
        onOpenChange={setOpen}
        modal={false}
      >
        <DrawerPrimitive.Content
          className="absolute bottom-2 left-2 top-2 z-10 flex w-[320px] outline-none"
          style={
            {
              "--initial-transform": "calc(100% + 8px)",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col rounded-lg bg-white p-6">
            <Header />
            {/* <div className="mx-auto max-w-md">
              <DrawerPrimitive.Title className="mb-2 font-medium text-zinc-900">
                It supports all directions.
              </DrawerPrimitive.Title>
              <DrawerPrimitive.Description className="mb-2 text-zinc-600">
                This one specifically is not touching the edge of the screen,
                but that&apos;s not required for a side drawer.
              </DrawerPrimitive.Description>
            </div> */}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Root>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
