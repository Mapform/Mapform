"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LngLatBounds, MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { useQuery } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { submitFormStep } from "~/data/submit-form-step";
import { getLayerData } from "~/data/datatracks/get-layer-data";
import { createFormSubmission } from "~/data/create-form-submission";
import { env } from "../env.mjs";
import type { FormWithSteps, Responses } from "./requests";

interface MapProps {
  formWithSteps: NonNullable<FormWithSteps>;
  formValues: NonNullable<Responses>;
  sessionId: string | null;
}

type Step = NonNullable<FormWithSteps>["steps"][number];

export function Map({ formWithSteps, formValues, sessionId }: MapProps) {
  const map = useRef<MapRef>(null);
  const { execute } = useAction(submitFormStep);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step | null>(
    formWithSteps.steps[0] || null
  );

  const initialViewState = {
    longitude: currentStep!.longitude,
    latitude: currentStep!.latitude,
    zoom: currentStep!.zoom,
    bearing: currentStep!.bearing,
    pitch: currentStep!.pitch,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  const currentStepIndex = formWithSteps.steps.findIndex(
    (step) => step.id === currentStep?.id
  );

  const dataTrackForActiveStep = formWithSteps.dataTracks.find((track) => {
    return (
      currentStepIndex >= track.startStepIndex &&
      currentStepIndex < track.endStepIndex
    );
  });

  const [bounds, setBounds] = useState<LngLatBounds | undefined>();

  const { data } = useQuery({
    placeholderData: (prevData) => prevData ?? { data: { points: [] } },
    queryKey: ["pointData", dataTrackForActiveStep?.id, bounds],
    queryFn: () =>
      getLayerData({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
        dataTrackId: dataTrackForActiveStep!.id,
        bounds: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
          minLng: bounds!._sw.lng,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
          minLat: bounds!._sw.lat,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
          maxLng: bounds!._ne.lng,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
          maxLat: bounds!._ne.lat,
        },
      }),
    enabled: Boolean(bounds) && Boolean(dataTrackForActiveStep),
    staleTime: Infinity,
  });

  const points = data?.data?.points.filter(notEmpty) || [];

  const setCurrentStepAndFly = (step: Step) => {
    setCurrentStep(step);
    map.current?.flyTo({
      center: [step.longitude, step.latitude],
      zoom: step.zoom,
      pitch: step.pitch,
      bearing: step.bearing,
      duration: 1000,
    });
  };

  useEffect(() => {
    void (async () => {
      let newSessionId = sessionId;

      if (!newSessionId) {
        const { data } = await createFormSubmission({
          formId: formWithSteps.id,
        });

        if (data) {
          newSessionId = data;
        }
      }
      setCurrentSession(newSessionId);
    })();
  }, []);

  const stepValues = (currentStep?.description?.content ?? []).reduce(
    (acc: Record<string, string>, block) => {
      const cellValue = formValues.find(
        (v) => v.column.blockNoteId === block.id
      );
      const value = cellValue?.stringCell?.value ?? cellValue?.pointCell?.value;

      if (value) {
        acc[block.id] = value;
      }

      return acc;
    },
    {}
  );

  if (!currentSession || !currentStep) {
    return null;
  }

  return (
    <MapForm
      currentStep={currentStep}
      defaultFormValues={stepValues}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onLoad={() => {
        const b = map.current?.getBounds();
        setBounds(b);
      }}
      onPrev={() => {
        const prevStepIndex =
          formWithSteps.steps.findIndex((step) => step.id === currentStep.id) -
          1;
        const prevStep = formWithSteps.steps[prevStepIndex];

        if (prevStep) {
          setCurrentStepAndFly(prevStep);
        }
      }}
      onStepSubmit={(data) => {
        execute({
          stepId: currentStep.id,
          formSubmissionId: currentSession,
          payload: data,
        });

        const nextStepIndex =
          formWithSteps.steps.findIndex((step) => step.id === currentStep.id) +
          1;
        const nextStep = formWithSteps.steps[nextStepIndex];

        if (nextStep) {
          setCurrentStepAndFly(nextStep);
        }
      }}
      points={points}
      ref={map}
      setViewState={setViewState}
      viewState={viewState}
    />
  );
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
