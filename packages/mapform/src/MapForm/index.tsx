"use client";

import type { MapRef, ViewState, ViewStateChangeEvent } from "react-map-gl";
import Map, { MapProvider, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { forwardRef } from "react";
import type { Step } from "@mapform/db";
import { Blocknote } from "./blocknote";
import { type CustomBlock } from "./blocknote/block-note-schema";

type ExtendedStep = Step & { latitude: number; longitude: number };

interface MapFormProps {
  editable?: boolean;
  mapboxAccessToken: string;
  currentStep?: ExtendedStep;
  viewState: ViewState;
  setViewState: (viewState: ViewStateChangeEvent) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onLoad?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
}

export const MapForm = forwardRef<MapRef, MapFormProps>(
  (
    {
      editable = false,
      onPrev,
      onNext,
      mapboxAccessToken,
      viewState,
      setViewState,
      currentStep,
      onLoad,
      onTitleChange,
      onDescriptionChange,
    },
    ref
  ) => {
    if (!currentStep) {
      return null;
    }

    return (
      <div className="flex w-full h-full">
        <div className="max-w-[320px] lg:max-w-[400px] w-full flex-shrink-0 bg-background shadow z-10">
          <Blocknote
            description={currentStep.description as { content: CustomBlock[] }}
            // Need key to force re-render, otherwise Blocknote state doesn't
            // change when changing steps
            editable={editable}
            key={currentStep.id}
            onDescriptionChange={onDescriptionChange}
            onNext={onNext}
            onPrev={onPrev}
            onTitleChange={onTitleChange}
            title={currentStep.title}
          />
        </div>
        <Map
          {...viewState}
          mapStyle="mapbox://styles/nichaley/clsxaiasf00ue01qjfhtt2v81"
          mapboxAccessToken={mapboxAccessToken}
          onLoad={onLoad}
          onMove={setViewState}
          ref={ref}
          style={{ flex: 1 }}
        />
      </div>
    );
  }
);

MapForm.displayName = "MapForm";

export { MapProvider, useMap };
export type { ViewState, ViewStateChangeEvent, MapRef };
