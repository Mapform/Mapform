"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LngLatBounds, MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import { useAction } from "next-safe-action/hooks";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Points } from "~/data/get-step-data";
import { submitFormStep } from "~/data/submit-form-step";
import { createFormSubmission } from "~/data/create-form-submission";
import { env } from "../env.mjs";
import type { FormWithSteps, Responses } from "./requests";

interface MapProps {
  points: Points;
  formWithSteps: NonNullable<FormWithSteps>;
  formValues: NonNullable<Responses>;
  sessionId: string | null;
}

type Step = NonNullable<FormWithSteps>["steps"][number];

export function Map({
  formWithSteps,
  formValues,
  sessionId,
  points,
}: MapProps) {
  const map = useRef<MapRef>(null);
  const { execute } = useAction(submitFormStep);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  // Selected step view
  const [currentSession, setCurrentSession] = useState<string | null>(null);

  const s = searchParams.get("s");
  const currentStep = formWithSteps.steps.find((step) => step.id === s);
  const setCurrentStep = (step: Step) => {
    router.push(`${pathname}?${createQueryString("s", step.id)}`);
  };

  // const [currentStep, setCurrentStep] = useState<Step | null>(
  //   formWithSteps.steps[0] || null
  // );

  const initialViewState = {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };
  const [viewState, setViewState] = useState<ViewState>({
    latitude: currentStep?.latitude ?? initialViewState.latitude,
    longitude: currentStep?.longitude ?? initialViewState.longitude,
    zoom: currentStep?.zoom ?? initialViewState.zoom,
    bearing: currentStep?.bearing ?? initialViewState.bearing,
    pitch: currentStep?.pitch ?? initialViewState.pitch,
    padding: initialViewState.padding,
  });

  const currentStepIndex = formWithSteps.steps.findIndex(
    (step) => step.id === currentStep?.id
  );

  const [bounds, setBounds] = useState<LngLatBounds | undefined>();

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

  useEffect(() => {
    if (formWithSteps.steps[0] && !s) {
      router.push(
        `${pathname}?${createQueryString("s", formWithSteps.steps[0].id)}`
      );
    }
  }, [s, formWithSteps.steps, pathname, router, createQueryString]);

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
