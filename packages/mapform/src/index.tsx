"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import type { Page } from "@mapform/db/schema";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import type { MapboxEvent } from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { CustomBlockContext } from "@mapform/blocknote";
import {
  type CustomBlock,
  getFormSchemaFromBlockNote,
} from "@mapform/blocknote";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import type { PageData, ViewState } from "@mapform/map-utils/types";
import { Button } from "@mapform/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";
import { Blocknote } from "./block-note";
import { Map, MapProvider, useMap, type MBMap } from "./map";
import { EditBar } from "./edit-bar";
import "./style.css";

interface MapFormProps {
  editable?: boolean;
  mapboxAccessToken: string;
  currentPage: Page;
  defaultFormValues?: Record<string, string>;
  contentViewType?: "full" | "partial" | "closed";
  onPrev?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  onLocationSave?: (location: ViewState) => Promise<{ success: boolean }>;
  pageData?: PageData;
  editFields?: {
    AddLocationDropdown: (input: { data: any }) => JSX.Element;
  };
}

export function MapForm({
  editable = false,
  onPrev,
  onLoad,
  pageData,
  editFields,
  currentPage,
  onStepSubmit,
  onTitleChange,
  onImageUpload,
  onLocationSave,
  defaultFormValues,
  onDescriptionChange,
}: MapFormProps) {
  const { map } = useMap();
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    currentPage.content?.content || []
  );
  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: defaultFormValues,
  });
  const [isSelectingPinLocationFor, setIsSelectingPinLocationFor] = useState<
    string | null
  >(null);
  const { ref: drawerRef } = useMeasure<HTMLDivElement>();
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
  const [movedCoords, setMovedCoords] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    pitch: number;
    bearing: number;
  }>({
    lat: currentPage.center.y,
    lng: currentPage.center.x,
    zoom: currentPage.zoom,
    pitch: currentPage.pitch,
    bearing: currentPage.bearing,
  });
  const [searchLocation, setSearchLocation] = useState<{
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    description?: {
      content: CustomBlock[];
    };
  } | null>(null);

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

  const handleOnMove = (e: MapboxEvent) => {
    setMovedCoords({
      lat: e.target.getCenter().lat,
      lng: e.target.getCenter().lng,
      zoom: e.target.getZoom(),
      pitch: e.target.getPitch(),
      bearing: e.target.getBearing(),
    });
  };

  useEffect(() => {
    if (map) {
      map.on("moveend", handleOnMove);

      return () => {
        map.off("moveend", handleOnMove);
      };
    }
  }, [map, currentPage]);

  // Update movedCoords when the step changes
  useEffect(() => {
    setMovedCoords({
      lat: currentPage.center.y,
      lng: currentPage.center.x,
      zoom: currentPage.zoom,
      pitch: currentPage.pitch,
      bearing: currentPage.bearing,
    });
  }, [currentPage]);

  const pinBlocks = currentPage.content?.content.filter((c) => {
    return c.type === "pin";
  });

  const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  const hasMoved =
    roundLocation(movedCoords.lat) !== roundLocation(currentPage.center.y) ||
    roundLocation(movedCoords.lng) !== roundLocation(currentPage.center.x) ||
    movedCoords.zoom !== currentPage.zoom ||
    movedCoords.pitch !== currentPage.pitch ||
    movedCoords.bearing !== currentPage.bearing;

  const AddLocationDropdown = editFields?.AddLocationDropdown;

  return (
    <Form {...form}>
      <form
        className="relative w-full h-full flex"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CustomBlockContext.Provider
          value={{
            editable,
            onImageUpload,
            isSelectingPinLocationFor,
            setIsSelectingPinLocationFor,
          }}
        >
          <div
            className={cn(
              "group absolute bg-background z-10 w-[360px]",
              currentPage.contentViewType === "text"
                ? "h-full w-full p-2 pb-0 z-10"
                : currentPage.contentViewType === "split"
                  ? "h-full p-2 pb-0 m-0"
                  : "h-initial rounded-lg shadow-lg p-0 m-2"
            )}
            ref={drawerRef}
          >
            <div
              className={cn("h-full", {
                // "pl-9": editable,
                "px-9": editable && currentPage.contentViewType === "text",
                "pl-9": editable && currentPage.contentViewType !== "text",
              })}
            >
              <Blocknote
                contentViewType={currentPage.contentViewType}
                currentPage={currentPage}
                description={currentPage.content ?? undefined}
                editable={editable}
                isPage
                key={currentPage.id}
                onDescriptionChange={onDescriptionChange}
                onPrev={onPrev}
                onTitleChange={onTitleChange}
                title={currentPage.title}
              >
                <div className="mt-auto flex justify-between p-4 pt-0">
                  <div className="gap-2">
                    <Button
                      disabled={editable}
                      onClick={onPrev}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <ChevronLeftIcon />
                    </Button>
                  </div>
                  <Button disabled={editable} type="submit">
                    Next
                  </Button>
                </div>
              </Blocknote>
            </div>
          </div>

          {/* MARKER EDITOR */}
          {searchLocation ? (
            <div
              className={cn(
                "group absolute bg-background z-10 w-[360px]",
                currentPage.contentViewType === "text"
                  ? "h-full w-full p-2 pb-0 z-10"
                  : currentPage.contentViewType === "split"
                    ? "h-full p-2 pb-0 m-0"
                    : "h-initial rounded-lg shadow-lg p-0 m-2"
              )}
              ref={drawerRef}
            >
              <div
                className={cn("h-full", {
                  // "pl-9": editable,
                  "px-9": editable && currentPage.contentViewType === "text",
                  "pl-9": editable && currentPage.contentViewType !== "text",
                })}
              >
                <Blocknote
                  contentViewType={currentPage.contentViewType}
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
                >
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
                </Blocknote>
              </div>
            </div>
          ) : null}
          {/* <Map
              onMove={(event) => {
                setViewState((prev) => ({
                  ...prev,
                  ...event.viewState,
                }));
              }}
              onMoveEnd={onMoveEnd}
            >
              {isSelectingPinLocationFor ? (
                <Marker
                  color="red"
                  latitude={viewState.latitude}
                  longitude={viewState.longitude}
                />
              ) : (
                pinBlocks?.map((block) => {
                  // @ts-expect-error -- This does in fact exist. Because the form is dynamic, TS can't infer the type.
                  const latitude = form.watch(
                    // @ts-expect-error -- This does in fact exist. Because the form is dynamic, TS can't infer the type.
                    `${block.id}.latitude`
                  ) as number;
                  // @ts-expect-error -- This does in fact exist. Because the form is dynamic, TS can't infer the type.
                  const longitude = form.watch(
                    // @ts-expect-error -- This does in fact exist. Because the form is dynamic, TS can't infer the type.
                    `${block.id}.longitude`
                  ) as number;

                  if (!latitude || !longitude) {
                    return null;
                  }

                  return (
                    <Marker
                      color="red"
                      key={block.id}
                      latitude={latitude}
                      longitude={longitude}
                      onDragEnd={(e) => {
                        // @ts-expect-error -- This does in fact exist. Because the form is dynamic, TS can't infer the type.
                        form.setValue(`${block.id}.latitude`, e.lngLat.lat);
                        // @ts-expect-error -- This does in fact exist. Because the form is dynamic, TS can't infer the type.
                        form.setValue(`${block.id}.longitude`, e.lngLat.lng);
                      }}
                    />
                  );
                })
              )}

              <Data points={points} />
            </Map> */}
          {currentPage.contentViewType !== "text" ? (
            <div className="relative flex flex-1 overflow-hidden">
              <Map
                editable={editable}
                initialViewState={initialViewState}
                marker={
                  searchLocation
                    ? {
                        latitude: searchLocation.latitude,
                        longitude: searchLocation.longitude,
                      }
                    : undefined
                }
                onLoad={onLoad}
                pageData={pageData}
              />

              {/* Edit bar */}
              {editable ? (
                <div
                  className="flex items-center bg-primary rounded-lg px-2 py-0 absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                  style={{
                    left:
                      currentPage.contentViewType === "split"
                        ? "calc(50% + 180px)"
                        : "50%",
                  }}
                >
                  <EditBar
                    hasMoved={hasMoved}
                    initialViewState={initialViewState}
                    onLocationSave={onLocationSave}
                    setSearchLocation={setSearchLocation}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </CustomBlockContext.Provider>
      </form>
    </Form>
  );
}

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, MBMap };
