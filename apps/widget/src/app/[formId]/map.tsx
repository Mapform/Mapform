"use client";

import { MapForm } from "@mapform/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useRef, useState } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { useSetQueryParams } from "@mapform/lib/hooks/use-set-query-params";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setQueryParams = useSetQueryParams();
  const createQueryString = useCreateQueryString();

  const s = searchParams.get("s");
  const currentStep = formWithSteps.steps.find((step) => step.id === s);
  const setCurrentStep = (step: Step) => {
    router.push(`${pathname}?${createQueryString("s", step.id)}`);
  };

  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState | null>(
    currentStep
      ? {
          latitude: currentStep.latitude,
          longitude: currentStep.longitude,
          zoom: currentStep.zoom,
          bearing: currentStep.bearing,
          pitch: currentStep.pitch,
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        }
      : null
  );

  const map = useRef<MapRef>(null);

  const { execute } = useAction(submitFormStep);

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
        const response = await createFormSubmission({
          formId: formWithSteps.id,
        });

        if (response?.data) {
          newSessionId = response.data;
        }
      }
      setCurrentSession(newSessionId);
    })();
  }, []);

  /**
   * Fix the 's' query param if no valid step
   */
  useEffect(() => {
    if (formWithSteps.steps[0] && (!s || !currentStep)) {
      router.push(
        `${pathname}?${createQueryString("s", formWithSteps.steps[0].id)}`
      );
    }
  }, [
    s,
    router,
    pathname,
    currentStep,
    createQueryString,
    formWithSteps.steps,
  ]);

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

  if (!currentSession || !currentStep || !viewState) {
    return null;
  }

  return (
    <MapForm
      currentStep={currentStep}
      defaultFormValues={stepValues}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onLoad={() => {
        const b = map.current?.getBounds();

        if (!b) {
          return;
        }

        setQueryParams({
          minLng: b._sw.lng.toString(),
          minLat: b._sw.lat.toString(),
          maxLng: b._ne.lng.toString(),
          maxLat: b._ne.lat.toString(),
        });
      }}
      onMoveEnd={() => {
        const b = map.current?.getBounds();

        if (!b) {
          return;
        }

        setQueryParams({
          minLng: b._sw.lng.toString(),
          minLat: b._sw.lat.toString(),
          maxLng: b._ne.lng.toString(),
          maxLat: b._ne.lat.toString(),
        });
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
