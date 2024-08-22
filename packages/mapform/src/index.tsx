"use client";

import {
  type MapRef,
  type ViewState,
  type ViewStateChangeEvent,
  Marker,
  NavigationControl,
  type LngLatBounds,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  useState,
} from "react";
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
import type { Points } from "@mapform/map-utils/types";
import { Blocknote } from "./block-note";
import { Data } from "./data";
import { Map, MapProvider, useMap, type MBMap } from "./map";

type ExtendedStep = Step & { latitude: number; longitude: number };

interface MapFormProps {
  editable?: boolean;
  mapboxAccessToken: string;
  currentStep?: ExtendedStep;
  viewState: ViewState;
  defaultFormValues?: Record<string, string>;
  setViewState: Dispatch<SetStateAction<ViewState | null>>;
  contentViewType?: "full" | "partial" | "closed";
  onPrev?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  onMoveEnd?: ((e: ViewStateChangeEvent) => void) | undefined;
  points?: Points;
}

export const MapForm = forwardRef<MapRef, MapFormProps>(
  (
    {
      editable = false,
      onPrev,
      mapboxAccessToken,
      viewState,
      setViewState,
      currentStep,
      onLoad,
      onTitleChange,
      onDescriptionChange,
      onStepSubmit,
      defaultFormValues,
      onImageUpload,
      onMoveEnd,
      points = [],
    },
    ref
  ) => {
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
      onStepSubmit && onStepSubmit(data);
    };

    const pinBlocks = currentStep?.description?.content.filter((c) => {
      return c.type === "pin";
    });

    return (
      <Form {...form}>
        <form
          className="relative w-full h-full flex"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomBlockContext.Provider
            value={{
              editable,
              viewState: {
                ...viewState,
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
              },
              setViewState,
              onImageUpload,
              isSelectingPinLocationFor,
              setIsSelectingPinLocationFor,
            }}
          >
            <div
              className={cn(
                "flex-shrink-0 backdrop-blur-md bg-background z-10 transition-[width,transform]",
                currentStep?.contentViewType === "FULL"
                  ? "w-full"
                  : currentStep?.contentViewType === "PARTIAL"
                    ? "w-[320px] lg:w-[400px]"
                    : "w-0 overflow-hidden"
              )}
              ref={drawerRef}
            >
              {currentStep ? (
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
              ) : null}
            </div>
            {/* <Map
              {...viewState}
              mapStyle="mapbox://styles/nichaley/clsxaiasf00ue01qjfhtt2v81"
              mapboxAccessToken={mapboxAccessToken}
              onLoad={onLoad}
              onMove={(event) => {
                setViewState((prev) => ({
                  ...prev,
                  ...event.viewState,
                }));
              }}
              onMoveEnd={onMoveEnd}
              projection={{
                name: "globe",
              }}
              ref={ref}
              style={{ flex: 1, borderRadius: editable ? "8px" : 0 }}
            >
              <NavigationControl />

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
            <Map
              editable={editable}
              initialViewState={viewState}
              points={points}
              setViewState={setViewState}
            />
          </CustomBlockContext.Provider>
        </form>
      </Form>
    );
  }
);

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef, LngLatBounds, MBMap };
