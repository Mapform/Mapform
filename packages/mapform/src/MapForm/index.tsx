"use client";

import Map, {
  type MapRef,
  type ViewState,
  type ViewStateChangeEvent,
  Marker,
  MapProvider,
  useMap,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { forwardRef, useState } from "react";
import type { Step } from "@mapform/db";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { z } from "zod";
import type { FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { getZodSchemaFromBlockNote } from "../lib/zod-schema-from-blocknote";
import { type CustomBlock } from "../lib/block-note-schema";
import { Blocknote } from "./block-note";
import { MapFormContext } from "./context";

type ExtendedStep = Step & { latitude: number; longitude: number };

interface MapFormProps {
  editable?: boolean;
  mapboxAccessToken: string;
  currentStep?: ExtendedStep;
  viewState: ViewState;
  defaultFormValues?: Record<string, string>;
  setViewState: (viewState: ViewStateChangeEvent) => void;
  onPrev?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onStepSubmit?: (data: Record<string, string>) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
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
    },
    ref
  ) => {
    const blocknoteStepSchema = getZodSchemaFromBlockNote(
      (currentStep?.description as { content: CustomBlock[] }).content || []
    );
    const form = useForm<z.infer<typeof blocknoteStepSchema>>({
      resolver: zodResolver(blocknoteStepSchema),
      defaultValues: defaultFormValues,
    });
    const [isSelectingPinLocationFor, setIsSelectingPinLocationFor] = useState<
      string | null
    >(null);

    const onSubmit = (data: FormSchema) => {
      onStepSubmit && onStepSubmit(data);
    };

    return (
      <Form {...form}>
        <form
          className="flex w-full h-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <MapFormContext.Provider
            value={{
              editable,
              onImageUpload,
              isSelectingPinLocationFor,
              setIsSelectingPinLocationFor,
            }}
          >
            <div className="max-w-[320px] lg:max-w-[400px] w-full flex-shrink-0 bg-background shadow z-10">
              {currentStep ? (
                <Blocknote
                  defaultFormValues={defaultFormValues}
                  description={
                    currentStep.description as { content: CustomBlock[] }
                  }
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
            <Map
              {...viewState}
              mapStyle="mapbox://styles/nichaley/clsxaiasf00ue01qjfhtt2v81"
              mapboxAccessToken={mapboxAccessToken}
              onClick={(e) => {
                if (!isSelectingPinLocationFor) {
                  return;
                }

                form.setValue(
                  `${isSelectingPinLocationFor}.latitude`,
                  e.lngLat.lat
                );

                form.setValue(
                  `${isSelectingPinLocationFor}.longitude`,
                  e.lngLat.lng
                );
              }}
              onLoad={onLoad}
              onMove={setViewState}
              ref={ref}
              style={{ flex: 1 }}
            >
              <NavigationControl />
              {/* <Marker
              latitude={currentStep?.latitude}
              longitude={currentStep?.longitude}
            /> */}
            </Map>
          </MapFormContext.Provider>
        </form>
      </Form>
    );
  }
);

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef };
