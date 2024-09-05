"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
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
import { Blocknote } from "./block-note";
import { Map, MapProvider, useMap, type MBMap } from "./map";
import { Button } from "@mapform/ui/components/button";
import { PenIcon } from "lucide-react";

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
  defaultFormValues,
  onDescriptionChange,
}: MapFormProps) {
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

  const onSubmit = (data: FormSchema) => {
    onStepSubmit?.(data);
  };

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
          <div className="relative flex flex-1">
            <Map
              editable={editable}
              initialViewState={initialViewState}
              onLoad={onLoad}
              points={points}
            />
            <Button
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
              size="sm"
            >
              <PenIcon className="w-3.5 h-3.5 mr-2 -ml-1" />
              Edit
            </Button>
          </div>
        </CustomBlockContext.Provider>
      </form>
    </Form>
  );
}

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, MBMap };
