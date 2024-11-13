"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import type { Page } from "@mapform/db/schema";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import { cn } from "@mapform/lib/classnames";
import { useWindowSize } from "@mapform/lib/hooks/use-window-size";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import { CustomBlockContext } from "@mapform/blocknote";
import type { GetLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import type { UpsertCellSchema } from "@mapform/backend/cells/upsert-cell/schema";
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
} from "lucide-react";
import { Blocknote } from "./block-note";
import { Map, SearchLocationMarker } from "./map";
import "./style.css";
import { MapformProvider, useMapform, type MBMap } from "./context";
import { DesktopDrawer } from "./drawers/desktop-drawer";

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
  onPoiCellChange?: (val: UpsertCellSchema) => void;
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
  const { width } = useWindowSize();
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

  const isMobile = width < 768;

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

  const mapPadding = {
    top: 0,
    bottom: 0,
    left:
      (drawerOpen || Boolean(activePoint)) && !isMobile
        ? editable
          ? 392
          : 360
        : 0,
    right: 0,
  };

  const renderButtons = () => (
    <div className="flex w-full items-center justify-between bg-white">
      <Button
        disabled={editable}
        onClick={onPrev}
        size="icon-sm"
        variant="ghost"
      >
        <ArrowLeftIcon className="size-5" />
      </Button>
      <p className="text-xs text-gray-500">Powered by Mapform</p>
      <Button disabled={editable} size="icon-sm" type="submit" variant="ghost">
        <ArrowRightIcon className="size-5" />
      </Button>
    </div>
  );

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full flex-col overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="relative flex flex-1 overflow-hidden">
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
                "absolute left-2 top-2 z-10 shadow-sm transition-opacity delay-300 duration-300 max-md:hidden",
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
            {/* <DrawerPrimitive.Root
                  activeSnapPoint={isMobile ? snap : undefined}
                  container={rootEl.current}
                  direction={isMobile ? "bottom" : "left"}
                  dismissible={false}
                  key={isMobile.toString()}
                  modal={false}
                  onOpenChange={setDrawerOpen}
                  // Always open on mobile
                  open={drawerOpen || isMobile}
                  setActiveSnapPoint={isMobile ? setSnap : undefined}
                  snapPoints={isMobile ? mobileSnapPoints : undefined}
                > */}
            <DesktopDrawer
              onClose={() => {
                setDrawerOpen(false);
              }}
              open={drawerOpen}
              withPadding={editable}
            >
              <div className="mx-auto mt-3 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300 md:hidden" />
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
                className={cn("px-2 pt-2", {
                  hidden: editable || isMobile,
                })}
              >
                {renderButtons()}
              </div>
            </DesktopDrawer>
            {/* <DrawerPrimitive.Root
                  container={rootEl.current}
                  direction={isMobile ? "bottom" : "left"}
                  dismissible={false}
                  key={activePoint?.rowId}
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
                > */}
            {/* <div
              className={cn(
                "bg-background prose group absolute bottom-0 top-0 z-50 h-full rounded-r-lg shadow-lg outline-none max-md:!w-full",
                editable ? "w-[392px] pl-8" : "w-[360px]",
              )}
            >
              <Blocknote
                currentPage={currentPage}
                description={
                  activePoint?.description?.richtextCell?.value ?? undefined
                }
                editable={editable}
                isPage
                key={currentPage.id}
                onDescriptionChange={(val) => {
                  activePoint?.description &&
                    onPoiCellChange &&
                    onPoiCellChange({
                      type: "richtext",
                      rowId: activePoint.rowId,
                      columnId: activePoint.description.columnId,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      value: val as any,
                    });
                }}
                onPrev={onPrev}
                onTitleChange={(val) => {
                  activePoint?.title &&
                    onPoiCellChange &&
                    onPoiCellChange({
                      type: "string",
                      rowId: activePoint.rowId,
                      columnId: activePoint.title.columnId,
                      value: val,
                    });
                }}
                title={activePoint?.title?.stringCell?.value}
              />
            </div> */}
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
        </div>
        <div className="p-2 md:hidden">{renderButtons()}</div>
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
