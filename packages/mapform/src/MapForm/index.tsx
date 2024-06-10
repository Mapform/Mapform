"use client";

import Map, {
  type MapRef,
  type ViewState,
  type ViewStateChangeEvent,
  MapProvider,
  useMap,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { forwardRef } from "react";
import type { Step } from "@mapform/db";
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
    return (
      <MapFormContext.Provider value={{ editable, onImageUpload }}>
        <div className="flex w-full h-full">
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
                onStepSubmit={onStepSubmit}
                onTitleChange={onTitleChange}
                title={currentStep.title}
              />
            ) : null}
          </div>
          <Map
            {...viewState}
            mapStyle="mapbox://styles/nichaley/clsxaiasf00ue01qjfhtt2v81"
            mapboxAccessToken={mapboxAccessToken}
            onLoad={onLoad}
            onMove={setViewState}
            ref={ref}
            style={{ flex: 1 }}
          >
            <NavigationControl />
          </Map>
        </div>
      </MapFormContext.Provider>
    );
  }
);

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef };
