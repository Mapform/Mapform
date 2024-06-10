"use client";

import React, { useEffect, useRef, useState } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { useAction } from "next-safe-action/hooks";
import { type ShortTextInputResponse } from "@mapform/db";
import { type DocumentContent } from "@mapform/mapform/lib/block-note-schema";
import { submitFormStep } from "~/server/actions/submit-form-step";
import { createFormSubmission } from "~/server/actions/create-form-submission";
import { env } from "../env.mjs";
import type { FormWithSteps } from "./requests";

interface MapProps {
  formWithSteps: NonNullable<FormWithSteps>;
  formValues: ShortTextInputResponse[];
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

  const stepValues = (
    (currentStep?.description?.content as DocumentContent) ?? []
  ).reduce((acc: Record<string, string>, block) => {
    const value = formValues.find((v) => v.blockNoteId === block.id)?.value;

    if (value) {
      acc[block.id] = value;
    }

    return acc;
  }, {});

  if (!currentSession || !currentStep) {
    return null;
  }

  return (
    <MapForm
      currentStep={currentStep}
      defaultFormValues={stepValues}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onNext={() => {
        const nextStepIndex =
          formWithSteps.steps.findIndex((step) => step.id === currentStep.id) +
          1;
        const nextStep = formWithSteps.steps[nextStepIndex];

        if (nextStep) {
          setCurrentStepAndFly(nextStep);
        }
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
      }}
      ref={map}
      setViewState={(evt) => {
        setViewState(evt.viewState);
      }}
      viewState={viewState}
    />
  );
}
