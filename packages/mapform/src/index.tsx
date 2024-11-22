"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useMemo, useState } from "react";
import type { Page } from "@mapform/db/schema";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import { cn } from "@mapform/lib/classnames";
import { motion, AnimatePresence } from "framer-motion";
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
import { ArrowLeftIcon, ArrowRightIcon, ChevronsRightIcon } from "lucide-react";
import { Blocknote } from "./block-note";
import { Map, SearchLocationMarker } from "./map";
import "./style.css";
import { MapformProvider, useMapform, type MBMap } from "./context";
import { DesktopDrawer } from "./drawers/desktop-drawer";
import { MobileDrawer } from "./drawers/mobile-drawer";

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

  // eslint-disable-next-line no-implicit-coercion -- Boolean causes another issue
  const isMobile = !!width && width < 768;

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

  const mapPadding = {
    top: 0,
    bottom: isMobile ? 200 : 0,
    left: drawerOpen && !isMobile ? (editable ? 392 : 360) : 0,
    right: 0,
  };

  const actionButtons = useMemo(
    () => (
      <div className="relative flex w-full items-center justify-between bg-white">
        {onPrev ? (
          <Button
            className="absolute left-0"
            disabled={editable}
            onClick={onPrev}
            size="icon-sm"
            variant="ghost"
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
        ) : null}
        <p className="mx-auto text-xs text-gray-500">Powered by Mapform</p>
        {onStepSubmit ? (
          <Button
            className="absolute right-0"
            disabled={editable}
            size="icon-sm"
            type="submit"
            variant="ghost"
          >
            <ArrowRightIcon className="size-5" />
          </Button>
        ) : null}
      </div>
    ),
    [editable, onPrev, onStepSubmit],
  );

  const pageContent = useMemo(
    () => (
      <>
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
          {actionButtons}
        </div>
      </>
    ),
    [
      actionButtons,
      currentPage,
      editable,
      isMobile,
      onDescriptionChange,
      onPrev,
      onTitleChange,
    ],
  );

  const activePointContent = useMemo(() => {
    if (!activePoint) {
      return null;
    }

    return (
      <Blocknote
        currentPage={currentPage}
        description={activePoint.description?.richtextCell?.value ?? undefined}
        editable={editable}
        isPage
        key={currentPage.id}
        onDescriptionChange={(val) => {
          activePoint.description &&
            onPoiCellChange &&
            onPoiCellChange({
              type: "richtext",
              rowId: activePoint.rowId,
              columnId: activePoint.description.columnId,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Fix this
              value: val as any,
            });
        }}
        onPrev={onPrev}
        onTitleChange={(val) => {
          activePoint.title &&
            onPoiCellChange &&
            onPoiCellChange({
              type: "string",
              rowId: activePoint.rowId,
              columnId: activePoint.title.columnId,
              value: val,
            });
        }}
        title={activePoint.title?.stringCell?.value}
      />
    );
  }, [activePoint, currentPage, editable, onPoiCellChange, onPrev]);

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full flex-col md:overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="relative flex-1 md:flex md:overflow-hidden">
          <CustomBlockContext.Provider
            value={{
              editable,
              onImageUpload,
              isSelectingPinLocationFor,
              setIsSelectingPinLocationFor,
            }}
          >
            {/* MAP CONTAINER */}
            <div className="top-0 flex flex-1 max-md:sticky max-md:mb-[-200px] max-md:h-dvh">
              <Map
                editable={editable}
                initialViewState={initialViewState}
                isMobile={isMobile}
                mapPadding={mapPadding}
                onLoad={onLoad}
                pageData={pageData}
              >
                {children}
              </Map>
            </div>
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
            {isMobile ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  animate={{
                    y: 0,
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
                  className="rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                  exit={{ y: 200, opacity: 0 }}
                  initial={{ y: 200, opacity: 0 }}
                  key={activePoint?.rowId}
                  layoutScroll
                  style={{
                    overflow: "scroll",
                  }}
                >
                  {!activePoint ? (
                    <MobileDrawer open={drawerOpen} withPadding={editable}>
                      {pageContent}
                    </MobileDrawer>
                  ) : (
                    <MobileDrawer
                      onClose={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setQueryString({
                          key: "layer_point",
                          value: null,
                        });
                      }}
                      open={Boolean(activePoint)}
                      withPadding={editable}
                    >
                      {activePointContent}
                    </MobileDrawer>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <>
                <DesktopDrawer
                  onClose={() => {
                    setDrawerOpen(false);
                  }}
                  open={drawerOpen}
                  withPadding={editable}
                >
                  {pageContent}
                </DesktopDrawer>
                <DesktopDrawer
                  onClose={() => {
                    setQueryString({
                      key: "layer_point",
                      value: null,
                    });
                  }}
                  open={Boolean(activePoint)}
                  withPadding={editable}
                >
                  {activePointContent}
                </DesktopDrawer>
              </>
            )}
          </CustomBlockContext.Provider>
        </div>
        <div className="fixed bottom-0 z-50 w-full bg-white p-2 md:hidden">
          {actionButtons}
        </div>
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
