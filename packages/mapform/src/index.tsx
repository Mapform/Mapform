"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import type { Step } from "@mapform/db";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import { cn } from "@mapform/lib/classnames";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { CustomBlockContext } from "@mapform/blocknote";
import {
  type CustomBlock,
  getFormSchemaFromBlockNote,
} from "@mapform/blocknote";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import type { Points, ViewState } from "@mapform/map-utils/types";
import { Button } from "@mapform/ui/components/button";
import { Undo2Icon } from "lucide-react";
import { Blocknote } from "./block-note";
import { Map, MapProvider, useMap, type MBMap } from "./map";

type ExtendedStep = Step & { latitude: number; longitude: number };

interface MapFormProps {
  editable?: boolean;
  mapboxAccessToken: string;
  currentStep?: ExtendedStep;
  defaultFormValues?: Record<string, string>;
  contentViewType?: "full" | "partial" | "closed";
  onPrev?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  onLocationSave?: (location: ViewState) => Promise<{ success: boolean }>;
  points?: Points;
}

export function MapForm({
  editable = false,
  onPrev,
  onLoad,
  currentStep,
  points = [],
  onStepSubmit,
  onTitleChange,
  onImageUpload,
  onLocationSave,
  defaultFormValues,
  onDescriptionChange,
}: MapFormProps) {
  const { map } = useMap();
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    currentStep?.description?.content || []
  );
  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: defaultFormValues,
  });
  const [isSelectingPinLocationFor, setIsSelectingPinLocationFor] = useState<
    string | null
  >(null);
  const { ref: drawerRef } = useMeasure<HTMLDivElement>();
  const [hasMoved, setHasMoved] = useState(false);

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

  const handleOnMove = () => {
    setHasMoved(true);
  };

  useEffect(() => {
    if (map) {
      map.on("move", handleOnMove);

      return () => {
        map.off("move", handleOnMove);
      };
    }
  }, [map]);

  if (!currentStep) {
    return null;
  }

  const pinBlocks = currentStep.description?.content.filter((c) => {
    return c.type === "pin";
  });

  const initialViewState = {
    longitude: currentStep.longitude,
    latitude: currentStep.latitude,
    zoom: currentStep.zoom,
    bearing: currentStep.bearing,
    pitch: currentStep.pitch,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };

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
              "flex-shrink-0 backdrop-blur-md bg-background z-10 transition-[width,transform]",
              currentStep.contentViewType === "FULL"
                ? "w-full"
                : currentStep.contentViewType === "PARTIAL"
                  ? "w-[320px] lg:w-[400px]"
                  : "w-0 overflow-hidden"
            )}
            ref={drawerRef}
          >
            <Blocknote
              defaultFormValues={defaultFormValues}
              description={currentStep.description ?? undefined}
              // Need key to force re-render, otherwise Blocknote state doesn't
              // change when changing steps
              editable={editable}
              key={currentStep.id}
              onDescriptionChange={onDescriptionChange}
              onPrev={onPrev}
              onTitleChange={onTitleChange}
              title={currentStep.title}
            />
          </div>
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
          <div className="relative flex flex-1 overflow-hidden">
            <Map
              editable={editable}
              initialViewState={initialViewState}
              onLoad={onLoad}
              points={points}
            />
            {/* Edit bar */}
            {editable ? (
              <div className="flex items-center bg-primary rounded-lg overflow-hidden px-2 py-0 absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <Button
                  disabled={!hasMoved}
                  onClick={() => {
                    map?.setCenter([
                      initialViewState.longitude,
                      initialViewState.latitude,
                    ]);
                    map?.setZoom(initialViewState.zoom);
                    map?.setPitch(initialViewState.pitch);
                    map?.setBearing(initialViewState.bearing);

                    setHasMoved(false);
                  }}
                  size="icon-sm"
                >
                  <Undo2Icon className="w-4 h-4" />
                </Button>
                <Button
                  disabled={!hasMoved}
                  onClick={async () => {
                    const center = map?.getCenter();
                    const zoom = map?.getZoom();
                    const pitch = map?.getPitch();
                    const bearing = map?.getBearing();

                    if (
                      onLocationSave &&
                      center !== undefined &&
                      zoom !== undefined &&
                      pitch !== undefined &&
                      bearing !== undefined
                    ) {
                      setHasMoved(false);
                      const result = await onLocationSave({
                        latitude: center.lat,
                        longitude: center.lng,
                        zoom,
                        pitch,
                        bearing,
                        padding: {
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                        },
                      });

                      if (!result.success) {
                        setHasMoved(true);
                      }
                    }
                  }}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            ) : null}
          </div>
        </CustomBlockContext.Provider>
      </form>
    </Form>
  );
}

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, MBMap };
