import React from "react";
import { cookies } from "next/headers";
import { MapProvider } from "@mapform/mapform";
import { type FormSubmission } from "@mapform/db";
import { getSession } from "~/data/get-session";
import { getStepData } from "~/data/get-step-data";
import { getFormWithSteps } from "~/data/get-form-with-steps";
import { type Responses, getResponses } from "~/data/get-responses.ts";
import { Map } from "./map";

// The DRAFT FormID
export default async function Page({
  params,
  searchParams,
}: {
  params: { formId: string };
  searchParams?: {
    s?: string;
  };
}) {
  const formWithSteps = await getFormWithSteps(params.formId);
  const cookieStore = cookies();
  const cookie = cookieStore.get("mapform-form-submission");
  const formValues: NonNullable<Responses> = [];
  const s = searchParams?.s;

  let session: FormSubmission | null = null;
  let stepData = null;

  if (!formWithSteps) {
    return <div>Form not found</div>;
  }

  if (!formWithSteps.steps.length) {
    return <div>Form has no steps</div>;
  }

  if (cookie) {
    session = await getSession(cookie.value, formWithSteps.id);

    if (session && session.publishedFormId === formWithSteps.id) {
      const responses = await getResponses(session.id);

      formValues.push(...responses);
    }
  }

  if (s) {
    stepData = await getStepData({ stepId: s });
  }

  return (
    <MapProvider>
      <Map
        formValues={formValues}
        formWithSteps={formWithSteps}
        points={stepData?.data ?? []}
        // We clear the session id if the form id doesn't match the current form
        sessionId={
          session?.publishedFormId === formWithSteps.id ? session.id : null
        }
      />
    </MapProvider>
  );
}
