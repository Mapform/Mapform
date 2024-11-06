"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useRef, useState } from "react";
import type { Page } from "@mapform/db/schema";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import { cn } from "@mapform/lib/classnames";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import { CustomBlockContext } from "@mapform/blocknote";
import type { GetLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import {
  type CustomBlock,
  getFormSchemaFromBlockNote,
} from "@mapform/blocknote";
import type { ViewState } from "@mapform/map-utils/types";
import type { PageData } from "@mapform/backend/datalayer/get-page-data";
import { Button } from "@mapform/ui/components/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  XIcon,
} from "lucide-react";
import { Blocknote } from "./block-note";
import { Map, SearchLocationMarker } from "./map";
import "./style.css";
import { MapformProvider, useMapform, type MBMap } from "./context";

interface MapFormProps {
  editable?: boolean;
  children?: React.ReactNode;
  mapboxAccessToken: string;
  currentPage: Page;
  defaultFormValues?: Record<string, string>;
  showBlocknote?: boolean;
  onPrev?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onPoiCellChange?: (val: any) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  pageData?: PageData;
  activePoint?: GetLayerPoint;
  // editFields?: {
  //   AddLocationDropdown: (input: { data: any }) => JSX.Element;
  // };
}

export function MapForm({
  editable = false,
  onPrev,
  onLoad,
  pageData,
  children,
  activePoint,
  currentPage,
  onStepSubmit,
  onTitleChange,
  onImageUpload,
  defaultFormValues,
  onDescriptionChange,
  onPoiCellChange,
}: MapFormProps) {
  const setQueryString = useSetQueryString();
  const { drawerOpen, setDrawerOpen } = useMapform();
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    currentPage.content?.content || [],
  );
  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: defaultFormValues,
  });
  const [isSelectingPinLocationFor, setIsSelectingPinLocationFor] = useState<
    string | null
  >(null);
  const rootEl = useRef<HTMLFormElement | null>(null);
  const initialViewState = {
    longitude: currentPage.center.x,
    latitude: currentPage.center.y,
    zoom: currentPage.zoom,
    bearing: currentPage.bearing,
    pitch: currentPage.pitch,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

  const mapPadding = {
    top: 0,
    bottom: 0,
    left: drawerOpen || Boolean(activePoint) ? (editable ? 392 : 360) : 0,
    right: 0,
  };

  return (
    <Form {...form}>
      <form
        className="relative flex h-full w-full overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
        ref={rootEl}
      >
        <CustomBlockContext.Provider
          value={{
            editable,
            onImageUpload,
            isSelectingPinLocationFor,
            setIsSelectingPinLocationFor,
          }}
        >
          <Button
            className={cn(
              "absolute left-2 top-2 z-10 shadow-sm transition-opacity delay-300 duration-300",
              {
                "opacity-0": drawerOpen,
              },
            )}
            onClick={() => {
              setDrawerOpen(true);
            }}
            size="icon-sm"
            variant="outline"
          >
            <ChevronsRightIcon className="size-5" />
          </Button>
          {rootEl.current ? (
            <>
              <DrawerPrimitive.Root
                container={rootEl.current}
                direction="left"
                dismissible={false}
                modal={false}
                onOpenChange={setDrawerOpen}
                open={drawerOpen}
              >
                <DrawerPrimitive.Portal>
                  <DrawerPrimitive.Content
                    className={cn(
                      "bg-background prose group absolute bottom-0 top-0 z-40 h-full rounded-r-lg shadow-lg outline-none",
                      editable ? "w-[392px] pl-8" : "w-[360px]",
                    )}
                  >
                    <Button
                      className="absolute right-2 top-2"
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <ChevronsLeftIcon className="size-5" />
                    </Button>
                    <Blocknote
                      currentPage={currentPage}
                      description={currentPage.content ?? undefined}
                      editable={editable}
                      isPage
                      key={currentPage.id}
                      onDescriptionChange={onDescriptionChange}
                      onPrev={onPrev}
                      onTitleChange={onTitleChange}
                      title={currentPage.title}
                    />
                    <div
                      className={cn("mt-auto flex justify-between px-4 py-2", {
                        hidden: editable,
                      })}
                    >
                      <div className="gap-2">
                        <Button
                          disabled={editable}
                          onClick={onPrev}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <ArrowLeftIcon />
                        </Button>
                      </div>
                      <Button
                        disabled={editable}
                        size="icon"
                        type="submit"
                        variant="ghost"
                      >
                        <ArrowRightIcon />
                      </Button>
                    </div>
                  </DrawerPrimitive.Content>
                </DrawerPrimitive.Portal>
              </DrawerPrimitive.Root>
              <DrawerPrimitive.Root
                container={rootEl.current}
                direction="left"
                dismissible={false}
                modal={false}
                onOpenChange={(val) => {
                  if (!val) {
                    setQueryString({
                      key: "layer_point",
                      value: null,
                    });
                  }
                }}
                open={Boolean(activePoint)}
              >
                <DrawerPrimitive.Portal>
                  <DrawerPrimitive.Content
                    className={cn(
                      "bg-background prose group absolute bottom-0 top-0 z-50 h-full rounded-r-lg shadow-lg outline-none",
                      editable ? "w-[392px] pl-8" : "w-[360px]",
                    )}
                  >
                    <Button
                      className="absolute right-2 top-2"
                      onClick={() => {
                        setQueryString({
                          key: "layer_point",
                          value: null,
                        });
                      }}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <XIcon className="size-5" />
                    </Button>
                    <Blocknote
                      currentPage={currentPage}
                      description={
                        activePoint?.description?.richtextCell?.value ??
                        undefined
                      }
                      editable={editable}
                      isPage
                      key={currentPage.id}
                      onDescriptionChange={(val) => {
                        activePoint &&
                          onPoiCellChange &&
                          onPoiCellChange({
                            type: "richtext",
                            rowId: activePoint.rowId,
                            columnId: activePoint.description?.columnId,
                            value: val,
                          });
                      }}
                      onPrev={onPrev}
                      onTitleChange={(val) => {
                        activePoint &&
                          onPoiCellChange &&
                          onPoiCellChange({
                            type: "string",
                            rowId: activePoint.rowId,
                            columnId: activePoint?.title?.columnId,
                            value: val,
                          });
                      }}
                      title={activePoint?.title?.stringCell?.value}
                    />
                  </DrawerPrimitive.Content>
                </DrawerPrimitive.Portal>
              </DrawerPrimitive.Root>
            </>
          ) : null}
          <Map
            editable={editable}
            initialViewState={initialViewState}
            mapPadding={mapPadding}
            onLoad={onLoad}
            pageData={pageData}
          >
            <div
              className={cn(
                "absolute bottom-0 right-0 top-0 transition-[width] duration-200",
                drawerOpen || Boolean(activePoint)
                  ? editable
                    ? "w-[calc(100%-392px)]"
                    : "w-[calc(100%-360px)]"
                  : "w-full",
              )}
            >
              {children}
            </div>
          </Map>
        </CustomBlockContext.Provider>
      </form>
    </Form>
  );
}

MapForm.displayName = "MapForm";

export { MapformProvider, useMapform, SearchLocationMarker };
export type { ViewState, MBMap };
export type { MapboxEvent } from "mapbox-gl";

// const pinBlocks = currentPage.content?.content.filter((c) => {
//   return c.type === "pin";
// });

// const AddLocationDropdown = editFields?.AddLocationDropdown;

/* {searchLocation ? (
  <div
    className={cn(
      "group absolute bg-background z-10 w-full overflow-hidden",
      currentPage.contentViewType === "text"
        ? "h-full z-10"
        : currentPage.contentViewType === "split"
          ? `h-full ${contentWidth}`
          : `h-initial ${contentWidth} rounded-lg shadow-lg md:m-2`
    )}
    ref={drawerRef}
  >
    <div
      className={cn(
        "h-full w-full flex flex-col prose max-md:max-w-full mx-auto relative",
        {
          "px-9": editable && currentPage.contentViewType === "text",
          "pl-9": editable && currentPage.contentViewType !== "text",
          "max-h-[300px]": currentPage.contentViewType === "map",
        }
      )}
    >
      <Blocknote
        currentPage={currentPage}
        description={searchLocation.description ?? undefined}
        // Need key to force re-render, otherwise Blocknote state doesn't
        // change when changing steps
        editable={editable}
        key={searchLocation.id}
        locationEditorProps={{
          onClose: () => {
            setSearchLocation(null);
          },
        }}
        onDescriptionChange={(val) => {
          setSearchLocation((prev) => ({
            id: prev?.id ?? "",
            description: val,
            name: prev?.name ?? "",
            latitude: prev?.latitude ?? 0,
            longitude: prev?.longitude ?? 0,
          }));
        }}
        onTitleChange={(val) => {
          setSearchLocation((prev) => ({
            ...prev,
            name: val,
            id: prev?.id ?? "",
            latitude: prev?.latitude ?? 0,
            longitude: prev?.longitude ?? 0,
          }));
        }}
        title={searchLocation.name}
      />
      {editable && AddLocationDropdown && currentPage.projectId ? (
        <div className="p-4 ml-auto">
          <AddLocationDropdown
            data={{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  searchLocation.longitude,
                  searchLocation.latitude,
                ],
              },
              properties: {},
            }}
          />
        </div>
      ) : null}
    </div>
  </div>
) : null} */
