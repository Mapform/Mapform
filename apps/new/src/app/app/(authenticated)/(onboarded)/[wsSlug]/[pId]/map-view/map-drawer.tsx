import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { Header } from "../header";
import { DRAWER_WIDTH } from "./contants";
import { useProject } from "../context";
import { useQueryStates } from "nuqs";
import { projectSearchParams, projectSearchParamsUrlKeys } from "../params";
import { XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";

interface MapDrawerProps {
  drawerOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
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

  return (
    <DrawerPrimitive.Root container={containerRef.current}>
      <DrawerPrimitive.Trigger className="absolute left-0 top-0 flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]">
        Open Drawer
      </DrawerPrimitive.Trigger>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/40" />
        <DrawerPrimitive.Content className="absolute bottom-0 left-0 right-0 mt-24 flex h-full max-h-[96%] flex-col rounded-t-[10px] bg-gray-100 lg:h-fit">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <div className="mx-auto max-w-md">
              <DrawerPrimitive.Title className="mb-4 font-medium text-gray-900">
                Nested Drawers.
              </DrawerPrimitive.Title>
              <p className="mb-2 text-gray-600">
                Nesting drawers creates a{" "}
                <a
                  href="https://sonner.emilkowal.ski/"
                  target="_blank"
                  className="underline"
                >
                  Sonner-like
                </a>{" "}
                stacking effect .
              </p>
              <p className="mb-2 text-gray-600">
                You can nest as many drawers as you want. All you need to do is
                add a `Drawer.NestedRoot` component instead of `Drawer.Root`.
              </p>
              <DrawerPrimitive.NestedRoot container={containerRef.current}>
                <DrawerPrimitive.Trigger className="mt-4 w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                  Open Second Drawer
                </DrawerPrimitive.Trigger>
                <DrawerPrimitive.Portal>
                  <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/40" />
                  <DrawerPrimitive.Content className="absolute bottom-0 left-0 right-0 mt-24 flex h-full max-h-[94%] flex-col rounded-t-[10px] bg-gray-100 lg:h-[327px]">
                    <div className="flex-1 rounded-t-[10px] bg-white p-4">
                      <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
                      <div className="mx-auto max-w-md">
                        <DrawerPrimitive.Title className="mb-4 font-medium text-gray-900">
                          This drawer is nested.
                        </DrawerPrimitive.Title>
                        <p className="mb-2 text-gray-600">
                          If you pull this drawer down a bit, it&apos;ll scale
                          the drawer underneath it as well.
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto border-t border-gray-200 bg-gray-100 p-4">
                      <div className="mx-auto flex max-w-md justify-end gap-6">
                        <a
                          className="gap-0.25 flex items-center text-xs text-gray-600"
                          href="https://github.com/emilkowalski/vaul"
                          target="_blank"
                        >
                          GitHub
                          <svg
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            aria-hidden="true"
                            className="ml-1 h-3 w-3"
                          >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                            <path d="M15 3h6v6"></path>
                            <path d="M10 14L21 3"></path>
                          </svg>
                        </a>
                        <a
                          className="gap-0.25 flex items-center text-xs text-gray-600"
                          href="https://twitter.com/emilkowalski_"
                          target="_blank"
                        >
                          Twitter
                          <svg
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            aria-hidden="true"
                            className="ml-1 h-3 w-3"
                          >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                            <path d="M15 3h6v6"></path>
                            <path d="M10 14L21 3"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </DrawerPrimitive.Content>
                </DrawerPrimitive.Portal>
              </DrawerPrimitive.NestedRoot>
            </div>
          </div>
          <div className="mt-auto border-t border-gray-200 bg-gray-100 p-4">
            <div className="mx-auto flex max-w-md justify-end gap-6">
              <a
                className="gap-0.25 flex items-center text-xs text-gray-600"
                href="https://github.com/emilkowalski/vaul"
                target="_blank"
              >
                GitHub
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                  aria-hidden="true"
                  className="ml-1 h-3 w-3"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                </svg>
              </a>
              <a
                className="gap-0.25 flex items-center text-xs text-gray-600"
                href="https://twitter.com/emilkowalski_"
                target="_blank"
              >
                Twitter
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                  aria-hidden="true"
                  className="ml-1 h-3 w-3"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                </svg>
              </a>
            </div>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );

  if (isDesktop) {
    return (
      <DrawerPrimitive.Root
        direction="left"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        modal={false}
        dismissible={false}
      >
        <DrawerPrimitive.Content
          className="absolute bottom-2 left-2 top-2 z-10 flex !select-text outline-none"
          style={
            {
              width: DRAWER_WIDTH,
              "--initial-transform": "calc(100% + 8px)",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col rounded-lg border bg-white p-6">
            <Header />
          </div>
          <DrawerPrimitive.NestedRoot
            open={!!rowId}
            direction="left"
            modal={false}
            onOpenChange={(open) => {
              if (!open) {
                void setProjectSearchParams({ rowId: undefined });
              }
            }}
            dismissible={false}
          >
            <DrawerPrimitive.Content
              className="absolute bottom-0 left-0 top-0 z-20 flex !select-text outline-none"
              style={
                {
                  width: DRAWER_WIDTH - 16,
                  "--initial-transform": "calc(100% + 8px)",
                } as React.CSSProperties
              }
            >
              <div className="flex h-full w-full grow flex-col rounded-lg border bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Feature Details</h3>
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
          </DrawerPrimitive.NestedRoot>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Root>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
