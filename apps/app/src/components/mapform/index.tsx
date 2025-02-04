"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useMemo, useState } from "react";
import type { Page } from "@mapform/db/schema";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import { cn } from "@mapform/lib/classnames";
import { useWindowSize } from "@mapform/lib/hooks/use-window-size";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import { CustomBlockContext } from "@mapform/blocknote";
import type { GetLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import type { GetLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import {
  type CustomBlock,
  getFormSchemaFromBlockNote,
} from "@mapform/blocknote";
import type { ViewState } from "@mapform/map-utils/types";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import { Button } from "@mapform/ui/components/button";
import { ArrowLeftIcon, ArrowRightIcon, ChevronsRightIcon } from "lucide-react";
import { Blocknote } from "./block-note";
import { Map, LocationMarker } from "./map";
import "./style.css";
import { MapformProvider, useMapform, type MBMap } from "./context";
import { MapDrawer } from "../map-drawer";
import { LocationSearch, LocationSearchButton } from "../location-search";

interface MapFormProps {
  editable?: boolean;
  children?: React.ReactNode;
  mapboxAccessToken: string;
  currentPage: Page;
  nextPage?: Page;
  defaultFormValues?: Record<string, string>;
  showBlocknote?: boolean;
  includeFormBlocks?: boolean;
  onPrev?: () => void;
  onLoad?: () => void;
  onIconChange?: (icon: string | null, type: "page" | "feature") => void;
  onTitleChange?: (content: string, type: "page" | "feature") => void;
  onDescriptionChange?: (
    content: { content: CustomBlock[] },
    type: "page" | "feature",
  ) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  pageData?: GetPageData["data"];
  selectedFeature?: GetLayerPoint["data"] | GetLayerMarker["data"];
}

export function MapForm({
  editable = false,
  onPrev,
  onLoad,
  pageData,
  children,
  selectedFeature,
  nextPage,
  currentPage,
  onIconChange,
  onStepSubmit,
  onTitleChange,
  onImageUpload,
  defaultFormValues,
  onDescriptionChange,
  includeFormBlocks = false,
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
  const [isSelectingPinBlockLocationFor, setIsSelectingPinBlockLocationFor] =
    useState<string | null>(null);
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

  const pageContent = useMemo(
    () => (
      <>
        <Blocknote
          description={currentPage.content as { content: CustomBlock[] }}
          editable={editable}
          icon={currentPage.icon}
          includeFormBlocks={includeFormBlocks}
          key={currentPage.id}
          onDescriptionChange={(val) => {
            if (onDescriptionChange) onDescriptionChange(val, "page");
          }}
          onIconChange={(val) => {
            if (onIconChange) onIconChange(val, "page");
          }}
          onPrev={onPrev}
          onTitleChange={(val) => {
            if (onTitleChange) onTitleChange(val, "page");
          }}
          title={currentPage.title}
        />
      </>
    ),
    [
      currentPage.content,
      currentPage.icon,
      currentPage.id,
      currentPage.title,
      editable,
      includeFormBlocks,
      onPrev,
      onDescriptionChange,
      onIconChange,
      onTitleChange,
    ],
  );

  const controls = useMemo(() => {
    return (
      <div
        className={cn("fixed bottom-0 z-50 w-full bg-white md:absolute", {
          hidden: editable,
        })}
      >
        <div className="px-2">
          <div className="relative flex h-[50px] w-full items-center justify-between">
            {onPrev ? (
              <Button
                className="absolute left-0"
                disabled={editable}
                onClick={onPrev}
                type="button"
                variant="ghost"
              >
                <ArrowLeftIcon className="-ml-1 mr-1 size-4" />
                Back
              </Button>
            ) : null}
            <p className="mx-auto text-xs text-gray-500">
              Made with{" "}
              <a className="text-gray-500" href="https://alpha.mapform.co">
                Mapform
              </a>
            </p>
            {onStepSubmit && currentPage.pageType === "page" ? (
              <Button
                className="absolute right-0"
                disabled={editable}
                type="submit"
              >
                {nextPage?.pageType === "page_ending" ? "Submit" : "Next"}
                <ArrowRightIcon className="-mr-1 ml-1 size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }, [
    currentPage.pageType,
    editable,
    nextPage?.pageType,
    onPrev,
    onStepSubmit,
  ]);

  const selectedFeatureContent = useMemo(() => {
    if (!selectedFeature) {
      return null;
    }

    return (
      <Blocknote
        description={
          selectedFeature.description?.richtextCell?.value ?? undefined
        }
        editable={editable}
        icon={selectedFeature.icon?.iconCell?.value}
        key={`${currentPage.id}-${selectedFeature.rowId}`}
        onDescriptionChange={(val) => {
          if (onDescriptionChange) onDescriptionChange(val, "feature");
        }}
        onIconChange={(val) => {
          if (onIconChange) onIconChange(val, "feature");
        }}
        onPrev={onPrev}
        onTitleChange={(val) => {
          if (onTitleChange) onTitleChange(val, "feature");
        }}
        title={selectedFeature.title?.stringCell?.value}
      />
    );
  }, [
    selectedFeature,
    editable,
    currentPage.id,
    onPrev,
    onDescriptionChange,
    onIconChange,
    onTitleChange,
  ]);

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
              imageBlock: {
                onImageUpload,
              },
              pinBlock: {
                isSelectingLocationFor: isSelectingPinBlockLocationFor,
                setIsSelectingLocationFor: (val) => {
                  // TODO: Improve this temporary workaround. If you don't
                  // scroll to the bottom first, there is a jarring animation
                  // when opening the next drawer
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => {
                    setIsSelectingPinBlockLocationFor(val);
                  }, 500);
                },
              },
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
              type="button"
              variant="outline"
            >
              <ChevronsRightIcon className="size-5" />
            </Button>
            <MapDrawer
              className="max-sm:min-h-[200px]"
              isEditing={editable}
              onClose={
                !isMobile
                  ? () => {
                      setDrawerOpen(false);
                    }
                  : undefined
              }
              open={
                drawerOpen &&
                !selectedFeature &&
                !isSelectingPinBlockLocationFor
              }
              positionDesktop="absolute"
            >
              {pageContent}
              {!isMobile && controls}
            </MapDrawer>
            {isMobile && !isSelectingPinBlockLocationFor && controls}
            <MapDrawer
              className="max-sm:min-h-[200px]"
              onClose={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setQueryString({
                  key: "feature",
                  value: null,
                });
              }}
              open={Boolean(selectedFeature)}
              isEditing={editable}
              positionDesktop="absolute"
            >
              {selectedFeatureContent}
            </MapDrawer>
            <MapDrawer
              className="max-sm:min-h-[200px]" // Shouldn't need to add this.
              open={!!isSelectingPinBlockLocationFor}
              onClose={() => setIsSelectingPinBlockLocationFor(null)}
              positionDesktop="absolute"
              positionMobile="fixed"
            >
              <LocationSearch>
                <LocationSearchButton
                  onClick={(selectedFeature) => {
                    form.setValue(
                      `${isSelectingPinBlockLocationFor}.y`,
                      selectedFeature?.properties?.lat,
                    );
                    form.setValue(
                      `${isSelectingPinBlockLocationFor}.x`,
                      selectedFeature?.properties?.lon,
                    );
                    setIsSelectingPinBlockLocationFor(null);
                  }}
                >
                  Select Location
                </LocationSearchButton>
              </LocationSearch>
            </MapDrawer>
          </CustomBlockContext.Provider>
        </div>
      </form>
    </Form>
  );
}

MapForm.displayName = "MapForm";

export { MapformProvider, useMapform, LocationMarker };
export type { ViewState, MBMap };
export type { MapboxEvent } from "mapbox-gl";
